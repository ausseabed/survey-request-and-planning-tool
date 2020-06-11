var express = require('express');
var _ = require('lodash');
import * as Boom from '@hapi/boom';

import { getConnection } from 'typeorm';

import { asyncMiddleware } from '../utils';


var router = express.Router();

router.get('/api', async function (req, res) {
  res.send("API server is running");
});

router.get('/database', asyncMiddleware(async function (req, res) {

  let connection = await getConnection();
  if (connection.isConnected) {
    res.send("Database is running and connected");
  } else {
    throw Boom.serverUnavailable("Database not connected")
  }

}));

module.exports = router;
