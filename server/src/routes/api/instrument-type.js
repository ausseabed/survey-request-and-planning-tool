var express = require('express');
var _ = require('lodash');
import * as Boom from '@hapi/boom';

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated } from '../utils';
import { InstrumentType } from '../../lib/entity/instrument-type';

var router = express.Router();

// Gets a list of instrument types
router.get('/', isAuthenticated, async function (req, res) {
  const whereOpts = _.isNil(req.query['user-submitted']) ?
    {} :
    {userSubmitted: (req.query['user-submitted'] == 'true')}

  let custodians = await getConnection()
  .getRepository(InstrumentType)
  .find({
    where:whereOpts,
    relations: ["dataCaptureTypes"]
  });
  return res.json(custodians);
});

module.exports = router;
