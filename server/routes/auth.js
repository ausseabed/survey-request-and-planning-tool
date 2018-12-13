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
var db = require('../lib/model/db')();
var AWS = require("aws-sdk");
var base64url = require("base64url");
var resolve = require('path').resolve;

var kms_endpoint = new AWS.Endpoint('https://kms.ap-southeast-2.amazonaws.com');
var kms = new AWS.KMS({ region: process.env.AWS_DEFAULT_REGION, endpoint: kms_endpoint });

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
    Axios.post(config.get('auth.crcsi.tokenEndpoint'), querystring.stringify({
        client_id: config.get('auth.crcsi.clientId'),
        client_secret: config.get('auth.crcsi.clientSecret'),
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
                return Axios.get(config.get('auth.crcsi.userInfoEndpoint'), {
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
        .then(function (userScope) {
            logger.verbose(userScope)
            var user_id = "crcsi" + userScope.sub;
            var user_exists = db.users.exists(user_id)
                .then(function (user) {
                    logger.verbose(user)
                    if (!user) {
                        return db.users.create({
                            id: user_id,
                            issuer: "crcsi",
                            issuer_sub: userScope.sub,
                            // Using Gravatar as default until CRCSI Accounts can send profile image across
                            avatar: 'https://www.gravatar.com/avatar/' + crypto.createHash('md5').update(userScope.email).digest("hex") + '?d=mm',
                            email: userScope.email,
                            name: userScope.name,
                            access_token: userScope.access_token,
                            refresh_token: userScope.refresh_token
                        });
                    }
                    else {
                        // Update user's access token if user already exists
                        logger.verbose(userScope)
                        return db.users.update(user.id, {
                            access_token: userScope.access_token,
                            refresh_token: userScope.refresh_token
                        });
                    }
                })
                .then(function (user) {
                    kms.decrypt({
                        CiphertextBlob: fs.readFileSync(resolve(__dirname + './../ssh_keys/private.encrypted'))
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
        })
        .catch(function (err) {
            var logid = logIdGen();
            logger.error(err, { id: logid });
            res.status(500).json({ error: "Something went wrong.", id: logid });
        });
}

module.exports = router;