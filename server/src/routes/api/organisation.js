var express = require('express');
var _ = require('lodash');
const boom = require('boom');

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated, permitPermission, sleep } from '../utils';
import { Organisation } from '../../lib/entity/organisation';


var router = express.Router();


async function getOrganisation(id) {

    let qb = getConnection()
    .getRepository(Organisation)
    .createQueryBuilder('organisation')
    .addSelect(
      '(SELECT COUNT(*) FROM hipp_request_organisations_organisation WHERE "hipp_request_organisations_organisation"."organisationId" = organisation.id) AS request_count'
    )
    .addSelect(
      '(SELECT COUNT(*) FROM project_metadata_organisations_organisation WHERE "project_metadata_organisations_organisation"."organisationId" = organisation.id) AS plan_count'
    )
    .orderBy('organisation.name', 'ASC')
    .where('organisation.id = :id', {id: id})
    const org = await qb.getOne();

    if (_.isNil(org)) {
      let err = boom.notFound(
        `Organisation ${id} does not exist`);
      throw err;
    }

    const orgRaw = await qb.getRawOne();
    org.requestCount = orgRaw.request_count
    org.planCount = orgRaw.plan_count

    return org
}


// Gets a single organisation by id
router.get(
  '/:id',
  [isAuthenticated],
  asyncMiddleware(async function (req, res) {

  const org = await getOrganisation(req.params.id)

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

  if (!_.isNil(req.body.id)) {
    const testOrg = await getOrganisation(req.body.id)
    if (testOrg.planCount != 0 || testOrg.requestCount != 0) {
      let err = boom.badRequest(
        `Organisation ${req.body.id} has linked request or plan, cannot modify`);
      throw err;
    }
  }

  var organisation = new Organisation()
  _.merge(organisation, req.body);

  organisation = await getConnection()
  .getRepository(Organisation)
  .save(organisation)

  // getOrganisation includes a few other fields for an org that are not part
  // or its entity definition
  organisation = await getOrganisation(organisation.id)
  return res.json(organisation)
}));

router.delete(
  '/:id',
  [isAuthenticated, permitPermission('canEditOrganisation')],
  asyncMiddleware(async function (req, res) {

  const organisationRepo = getConnection().getRepository(Organisation);

  const organisation = await getOrganisation(req.params.id)

  if (!organisation) {
    let err = boom.notFound(
      `Organisation ${req.params.id} does not exist, cannot delete`);
    throw err;
  }

  // check if org is linked to plan or request, and fail request if it is
  // removing the following will work, deleted orgs are then removed from
  // the projects they have been assigned too.
  if (organisation.planCount != 0 || organisation.requestCount != 0) {
    let err = boom.badRequest(
      `Organisation ${req.params.id} has linked request or plan, cannot delete`);
    throw err;
  }

  await getConnection().getRepository(Organisation)
  .createQueryBuilder()
  .delete()
  .from(Organisation)
  .where(`id = :id`, {id: req.params.id})
  .execute();

  return res.json(organisation)

}));

module.exports = router;
