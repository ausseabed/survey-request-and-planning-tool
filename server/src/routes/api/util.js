var express = require('express');
var _ = require('lodash');
import * as Boom from '@hapi/boom';


var router = express.Router();

router.get('/analytics-code', async function (req, res) {
  res.send(process.env.ANALYTICS_CODE);
});

module.exports = router;
