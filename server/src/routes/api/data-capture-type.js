var express = require('express');
var _ = require('lodash');
import * as Boom from '@hapi/boom';

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated } from '../utils';
import { DataCaptureType } from '../../lib/entity/data-capture-type';

var router = express.Router();

// Gets a list of instrument types
router.get('/', isAuthenticated, async function (req, res) {
  const whereOpts = _.isNil(req.query['user-submitted']) ?
    {} :
    {userSubmitted: (req.query['user-submitted'] == 'true')}

  if (!_.isNil(req.query['plan'])) {
    whereOpts.appliesToPlan = req.query['plan'] == 'true'
  }
  if (!_.isNil(req.query['request'])) {
    whereOpts.appliesToRequest = req.query['request'] == 'true'
  }

  let custodians = await getConnection()
  .getRepository(DataCaptureType)
  .find({
    where:whereOpts
  });
  return res.json(custodians);
});

module.exports = router;
