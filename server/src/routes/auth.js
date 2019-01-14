var express = require('express');
var logger = require('../lib/logger').logger;
var logIdGen = require('../lib/logger').logId;
var Request = require('request');
var Axios = require('axios');
var config = require('config');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var crypto = require('crypto');
var _ = require('lodash');
var AWS = require("aws-sdk");
var base64url = require("base64url");
var resolve = require('path').resolve;

import { getConnection } from 'typeorm';
import { User } from '../lib/entity/user';

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
    `${process.env.QA4L_CRCSI_ACCOUNTS_URL}o/oauth2/token`;
  const authUserInfoEndpoint =
    `${process.env.QA4L_CRCSI_ACCOUNTS_URL}o/oauth2/userinfo`;

  Axios.post(authTokenEndpoint, querystring.stringify({
    client_id: process.env.QA4L_CRCSI_ACCOUNTS_CLIENT_ID,
    client_secret: process.env.QA4L_CRCSI_ACCOUNTS_SECRET,
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
      logger.error('CRCSI responsed with error', { id: logid });
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
    var user_id = "crcsi" + userScope.sub;
    const userRepo = getConnection().getRepository(User);
    const existingUser = await userRepo.findOne(user_id);

    let user = undefined;
    if (existingUser) {
      existingUser.accessToken = userScope.access_token;
      existingUser.refreshToken = userScope.refresh_token;
      await userRepo.save(existingUser);
      user = existingUser;
    } else {
      const newUser = new User();
      newUser.id = user_id;
      newUser.issuer = "crcsi";
      newUser.issuerSub = userScope.sub;
      newUser.avatar = 'https://www.gravatar.com/avatar/' +
        crypto.createHash('md5').update(userScope.email).digest("hex") +
        '?d=mm';
      newUser.email = userScope.email;
      newUser.name = userScope.name;
      newUser.accessToken = userScope.access_token;
      newUser.refreshToken = userScope.refresh_token;
      await userRepo.save(newUser);
      user = newUser;
    }
    return user;
  })
  .then(function (user) {
    var kms = new AWS.KMS({ region: process.env.AWS_DEFAULT_REGION});
    kms.decrypt({
      CiphertextBlob: fs.readFileSync(resolve(__dirname + './../../ssh_keys/private.encrypted'))
    }, (err, data) => {
      if (err) return res.status(500).json({ error: "Error decrypting" });

      var cert_priv = base64url.decode(data.Plaintext.toString("base64"));
      var signed_jwt = jwt.sign({
        id: user.id,
        avatar: user.avatar,
        email: user.email,
        name: user.name
      }, cert_priv, { expiresIn: 30 * 24 * 60 * 60, algorithm: 'RS256' });

      return res.json({ 'access_token': signed_jwt });
    });
  })
  .catch(function (err) {
    var logid = logIdGen();
    logger.error(err, { id: logid });
    res.status(500).json({ error: "Something went wrong.", id: logid });
  });
}

module.exports = router;
