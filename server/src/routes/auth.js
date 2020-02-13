var express = require('express');
var logger = require('../lib/logger').logger;
var logIdGen = require('../lib/logger').logId;
var Request = require('request');
var Axios = require('axios');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var crypto = require('crypto');
var _ = require('lodash');
const url = require('url');
var base64url = require("base64url");
var resolve = require('path').resolve;

import { getConnection } from 'typeorm';
import { User } from '../lib/entity/user';
import { Role } from '../lib/entity/role';

var router = express.Router();
var querystring = require('querystring');

router.post('/:provider', function (req, res) {
    switch (req.params.provider) {
        case 'crcsi':
            crcsiAuth(req, res)
            break;
    }
});

function crcsiAuth(req, res) {
  const authTokenEndpoint =
    url.resolve(process.env.AUTH_HOST, 'oauth2/token');
  const authUserInfoEndpoint =
    url.resolve(process.env.AUTH_HOST, 'oauth2/userInfo');

  Axios.post(authTokenEndpoint, querystring.stringify({
    client_id: process.env.AUTH_CLIENT_ID,
    client_secret: process.env.AUTH_CLIENT_SECRET,
    code: req.body.code,
    redirect_uri: req.body.redirectUri,
    state: req.body.state,
    grant_type: 'authorization_code'
  }))
  .then(function (response) {
    var responseJson = response.data;
    logger.verbose(responseJson)
    if (responseJson.error) {
      var logid = logIdGen();
      logger.error('Auth system responsed with error', { id: logid });
      res.status(500).json({ error: responseJson.error, id: logid });
    } else {
      return Axios.get(authUserInfoEndpoint, {
        headers: { Authorization: 'Bearer ' + responseJson.access_token }
      })
      .then((userInfo) => {
        return _.merge({
          access_token: responseJson.access_token,
          refresh_token: responseJson.refresh_token
        }, userInfo.data);
      });
    }
  })
  .then(async function (userScope) {
    logger.verbose(userScope);
    var user_id = "ausseabed-" + userScope.sub;
    const userRepo = getConnection().getRepository(User);
    let existingUser = await userRepo.findOne(user_id);
    if (_.isNil(existingUser)) {
      // then it could be an older user id carried over from crcsi accounts
      existingUser = await userRepo.findOne({
        where: {
          'issuer': 'ausseabed',
          'issuerSub': userScope.sub
        }
      });
    }
    if (_.isNil(existingUser)) {
      // then it could be an older user id carried over from crcsi accounts
      // that hasn't had the issuer and issuerSub updated.
      // Once all legacy users have logged in this if block can be removed
      existingUser = await userRepo.createQueryBuilder()
       .where("email ILIKE :email", { email: userScope.email })
       .getOne();
      if (!_.isNil(existingUser)) {
        existingUser.issuer = 'ausseabed';
        existingUser.issuerSub = userScope.sub;
      }
    }

    let user = undefined;
    if (existingUser) {
      existingUser.accessToken = userScope.access_token;
      existingUser.refreshToken = userScope.refresh_token;
      await userRepo.save(existingUser);
      user = existingUser;
    } else {
      const roleRepo = getConnection().getRepository(Role);

      // the first user is made an Administrator, otherwise no user would be
      // able to access admin features to create an Administrator
      const userCount = await userRepo.count();
      let userRole = undefined;
      if (userCount == 0) {
        userRole = await roleRepo.findOne({name: "Administrator"});
      } else {
        userRole = await roleRepo.findOne({isDefault: true});
      }

      const newUser = new User();
      newUser.id = user_id;
      newUser.issuer = 'ausseabed';
      newUser.issuerSub = userScope.sub;
      newUser.avatar = 'https://www.gravatar.com/avatar/' +
        crypto.createHash('md5').update(userScope.email).digest("hex") +
        '?d=mm';
      newUser.email = userScope.email;
      newUser.name = _.isNil(userScope.name) ? "" : userScope.name;
      newUser.accessToken = userScope.access_token;
      newUser.refreshToken = userScope.refresh_token;
      if (!_.isNil(userRole)) {
        newUser.role = userRole;
      }
      await userRepo.save(newUser);
      user = newUser;
    }
    return user;
  })
  .then(function (user) {
    //Get private key from env var
    //This key needs some tweaks to get in usable form due to its
    //specification as an env var (and limitations on new lines, etc)
    var cert_priv = process.env.JWT_TOKEN_KEY_PRIVATE.replace(/\\n/g, '\n');
    cert_priv = cert_priv.substring(1, cert_priv.length-1);
    var signed_jwt = jwt.sign({
      id: user.id,
      avatar: user.avatar,
      email: user.email,
      name: user.name
    }, cert_priv, { expiresIn: 30 * 24 * 60 * 60, algorithm: 'RS256' });

    res.setHeader('Set-Cookie', `Authorization=Bearer ${signed_jwt} ; Path=/`);
    return res.json({ 'access_token': signed_jwt });
  })
  .catch(function (err) {
    var logid = logIdGen();
    logger.error(err, { id: logid });
    res.status(500).json({ error: "Something went wrong.", id: logid });
  });
}

module.exports = router;
