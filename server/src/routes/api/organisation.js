var express = require('express');
var _ = require('lodash');
const boom = require('boom');

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated, permitPermission } from '../utils';
import { Organisation } from '../../lib/entity/organisation';


var router = express.Router();

// gets a single role for the current logged in user
router.get(
  '/user-organisation',
  isAuthenticated,
  asyncMiddleware(async function (req, res) {

  let org = req.user.organisation

  if (!org || org.deleted) {
    let err = boom.notFound(
      `Currently logged in user has no organisation`);
    throw err;
  }

  // don't return the deleted flag
  delete org.deleted;

  return res.json(org);
}));


// Gets a list of organisations
router.get(
  '/',
  [isAuthenticated],
  asyncMiddleware(async function (req, res) {

  const whereOpts = {};
  if (!_.isNil(req.query['deleted'])) {
    whereOpts.deleted = req.query['deleted'];
  }

  let orgs = await getConnection()
  .getRepository(Organisation)
  .find({
    where:whereOpts,
    order: {name: 'ASC'}
  });
  return res.json(orgs);
}));

// creates a new organisation
router.post(
  '/',
  [isAuthenticated, permitPermission('canEditOrganisation')],
  asyncMiddleware(async function (req, res) {

  var org = new Organisation()
  _.merge(org, req.body);

  org = await getConnection()
  .getRepository(Organisation)
  .save(org)

  // because the saved version of org doesn't include all attribs
  org = await getConnection()
  .getRepository(Organisation)
  .findOne(org.id)
  return res.json(org)
}));

router.delete(
  '/:id',
  [isAuthenticated, permitPermission('canEditOrganisation')],
  asyncMiddleware(async function (req, res) {

  const orgRepo = getConnection().getRepository(Organisation);

  let org = await orgRepo.findOne(req.params.id);

  if (!org) {
    let err = boom.notFound(
      `Organisation ${req.params.id} does not exist, cannot delete`);
    throw err;
  }

  org.deleted = true;
  org = await orgRepo.save(org);

  // because the saved version of org doesn't include all attribs
  org = await getConnection()
  .getRepository(Organisation)
  .findOne(org.id)
  return res.json(org)
}));

module.exports = router;
