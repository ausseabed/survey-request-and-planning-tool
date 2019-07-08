var express = require('express');
var _ = require('lodash');
const boom = require('boom');

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated } from '../utils';
import { RequestPurpose } from '../../lib/entity/request-purpose';

var router = express.Router();

// Gets a list of request purposes
router.get('/', isAuthenticated, async function (req, res) {

  let requestPurposes = await getConnection()
  .getRepository(RequestPurpose)
  .find();
  return res.json(requestPurposes);
});

module.exports = router;
