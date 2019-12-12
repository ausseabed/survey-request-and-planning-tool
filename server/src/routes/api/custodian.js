var express = require('express');
var _ = require('lodash');
import * as Boom from '@hapi/boom';

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated, permitPermission } from '../utils';
import { Custodian } from '../../lib/entity/custodian';


var router = express.Router();

// gets a single role for the current logged in user
router.get(
  '/user-custodian',
  isAuthenticated,
  asyncMiddleware(async function (req, res) {

  let custodian = req.user.custodian

  if (!custodian || custodian.deleted) {
    let err = Boom.notFound(
      `Currently logged in user has no custodian`);
    throw err;
  }

  // don't return the deleted flag
  delete custodian.deleted;

  return res.json(custodian);
}));


// Gets a list of custodians
router.get(
  '/',
  [isAuthenticated],
  asyncMiddleware(async function (req, res) {

  const whereOpts = {};
  if (!_.isNil(req.query['deleted'])) {
    whereOpts.deleted = req.query['deleted'];
  }

  let custodians = await getConnection()
  .getRepository(Custodian)
  .find({
    where:whereOpts,
    order: {name: 'ASC'}
  });
  return res.json(custodians);
}));

// creates a new custodian
router.post(
  '/',
  [isAuthenticated, permitPermission('canEditCustodian')],
  asyncMiddleware(async function (req, res) {

  var custodian = new Custodian()
  _.merge(custodian, req.body);

  custodian = await getConnection()
  .getRepository(Custodian)
  .save(custodian)

  // because the saved version of custodian doesn't include all attribs
  custodian = await getConnection()
  .getRepository(Custodian)
  .findOne(custodian.id)
  return res.json(custodian)
}));

router.delete(
  '/:id',
  [isAuthenticated, permitPermission('canEditCustodian')],
  asyncMiddleware(async function (req, res) {

  const custodianRepo = getConnection().getRepository(Custodian);

  let custodian = await custodianRepo.findOne(req.params.id);

  if (!custodian) {
    let err = Boom.notFound(
      `Custodian ${req.params.id} does not exist, cannot delete`);
    throw err;
  }

  custodian.deleted = true;
  custodian = await custodianRepo.save(custodian);

  // because the saved version of custodian doesn't include all attribs
  custodian = await getConnection()
  .getRepository(Custodian)
  .findOne(custodian.id)
  return res.json(custodian)
}));

module.exports = router;
