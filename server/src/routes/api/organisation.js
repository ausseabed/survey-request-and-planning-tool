var express = require('express');
var _ = require('lodash');
const boom = require('boom');

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated, permitPermission } from '../utils';
import { Organisation } from '../../lib/entity/organisation';


var router = express.Router();

// Gets a list of organisations
router.get(
  '/',
  [isAuthenticated],
  asyncMiddleware(async function (req, res) {

  const whereOpts = {};
  if (!_.isNil(req.query['deleted'])) {
    whereOpts.deleted = req.query['deleted'];
  }

  let organisations = await getConnection()
  .getRepository(Organisation)
  .find({
    where:whereOpts,
    order: {name: 'ASC'}
  });
  return res.json(organisations);
}));

// creates a new organisation
router.post(
  '/',
  [isAuthenticated, permitPermission('canEditOrganisation')],
  asyncMiddleware(async function (req, res) {

  var organisation = new Organisation()
  _.merge(organisation, req.body);

  organisation = await getConnection()
  .getRepository(Organisation)
  .save(organisation)

  // because the saved version of organisation doesn't include all attribs
  organisation = await getConnection()
  .getRepository(Organisation)
  .findOne(organisation.id)
  return res.json(organisation)
}));

router.delete(
  '/:id',
  [isAuthenticated, permitPermission('canEditOrganisation')],
  asyncMiddleware(async function (req, res) {

  const organisationRepo = getConnection().getRepository(Organisation);

  let organisation = await organisationRepo.findOne(req.params.id);

  if (!organisation) {
    let err = boom.notFound(
      `Organisation ${req.params.id} does not exist, cannot delete`);
    throw err;
  }

  let err = boom.notFound(
    `Not implemented`);
  throw err;


}));

module.exports = router;
