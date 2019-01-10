var express = require('express');
var _ = require('lodash');
const boom = require('boom');

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated } from '../utils';
import { DataCaptureType } from '../../lib/entity/data-capture-type';

var router = express.Router();

// Gets a list of instrument types
router.get('/', async function (req, res) {
  const whereOpts = _.isNil(req.query['user-submitted']) ?
    {} :
    {userSubmitted: (req.query['user-submitted'] == 'true')}

  let orgs = await getConnection()
  .getRepository(DataCaptureType)
  .find({
    where:whereOpts
  });
  return res.json(orgs);
});

module.exports = router;
