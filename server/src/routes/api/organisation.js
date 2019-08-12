var express = require('express');
var _ = require('lodash');
const boom = require('boom');

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated, permitPermission, sleep } from '../utils';
import { Organisation } from '../../lib/entity/organisation';


var router = express.Router();


// Gets a single organisation by id
router.get(
  '/:id',
  [isAuthenticated],
  asyncMiddleware(async function (req, res) {

  let qb =getConnection()
  .getRepository(Organisation)
  .createQueryBuilder('organisation')
  .addSelect(
    '(SELECT COUNT(*) FROM hipp_request_organisations_organisation WHERE "hipp_request_organisations_organisation"."organisationId" = organisation.id) AS request_count'
  )
  .addSelect(
    '(SELECT COUNT(*) FROM project_metadata_organisations_organisation WHERE "project_metadata_organisations_organisation"."organisationId" = organisation.id) AS plan_count'
  )
  .orderBy('organisation.name', 'ASC')
  .where('organisation.id = :id', {id: req.params.id})
  const org = await qb.getOne();

  if (_.isNil(org)) {
    let err = boom.notFound(
      `Organisation ${req.params.id} does not exist`);
    throw err;
  }

  const orgRaw = await qb.getRawOne();
  org.requestCount = orgRaw.request_count
  org.planCount = orgRaw.plan_count

  return res.json(org);
}));


// Gets a list of organisations
router.get(
  '/',
  [isAuthenticated],
  asyncMiddleware(async function (req, res) {

  // // to test if loading indicator shows
  // await sleep(1000)

  let { start, limit, filter } = req.query;

  start = _.isNil(start) ? 0 : start;
  limit = _.isNil(limit) ? 20 : limit;
  limit = limit > 100 ? 100 : limit;  // don't ever allow more than 100

  let qb =getConnection()
  .getRepository(Organisation)
  .createQueryBuilder('organisation')
  .addSelect(
    '(SELECT COUNT(*) FROM hipp_request_organisations_organisation WHERE "hipp_request_organisations_organisation"."organisationId" = organisation.id) AS request_count'
  )
  .addSelect(
    '(SELECT COUNT(*) FROM project_metadata_organisations_organisation WHERE "project_metadata_organisations_organisation"."organisationId" = organisation.id) AS plan_count'
  )
  .orderBy('organisation.name', 'ASC');

  if (!_.isNil(filter)) {
    // if filter provided, check if filtering by org name or abn
    qb = qb
    .where('organisation.name ilike :name', {name: '%' + filter + '%' })
    .orWhere('organisation.abn ilike :abn', {abn: '%' + filter + '%' })
  }

  let count = await qb.getCount();

  qb = qb
  .offset(start)
  .limit(limit);

  const orgData = await qb.getRawAndEntities();
  const orgEntities = orgData.entities
  for (let i = 0; i < orgEntities.length; i++) {
    orgEntities[i].requestCount = orgData.raw[i].request_count
    orgEntities[i].planCount = orgData.raw[i].plan_count
  }

  return res.json({
    count: count,
    data: orgEntities
  });
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
