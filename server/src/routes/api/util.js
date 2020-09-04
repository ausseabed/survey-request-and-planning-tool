var express = require('express');
var _ = require('lodash');
import * as Boom from '@hapi/boom';


var router = express.Router();

router.get('/analytics-code', async function (req, res) {
  res.send(process.env.ANALYTICS_CODE);
});

router.get('/auth-details', async function (req, res) {
  res.json({
    authClientId: process.env.AUTH_CLIENT_ID,
    authHost: process.env.AUTH_HOST
  });
});

module.exports = router;
