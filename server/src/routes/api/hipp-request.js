var express = require('express');
var _ = require('lodash');
const boom = require('boom');

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated, geojsonToMultiPolygon, hasPermission,
  permitOrgBasedPermission } from '../utils';
import { HippRequest, SURVEY_QUALITY_REQUIREMENTS,
  CHART_PRODUCT_QUALITY_IMPACT_REQUIREMENTS, RISK_MATRIX}
  from '../../lib/entity/hipp-request';


var router = express.Router();

router.get('/survey-quality-requirements', async function (req, res) {
  return res.json(SURVEY_QUALITY_REQUIREMENTS);
});

router.get(
  '/chart-product-quality-impact-requirements',
  async function (req, res) {

  return res.json(CHART_PRODUCT_QUALITY_IMPACT_REQUIREMENTS);
});

router.get('/risk-matrix', async function (req, res) {
  return res.json(RISK_MATRIX);
});

// Gets a list of HIPP Requests
router.get('/', isAuthenticated, asyncMiddleware(async function (req, res) {

  let hippRequestQuery = getConnection()
  .getRepository(HippRequest)
  .createQueryBuilder("hipp_request")
  .select(["hipp_request.id", "hipp_request.name",
    "hipp_request.requestDateStart", "hipp_request.requestDateEnd",
    "hipp_request.areaName"])
  .where(
    `hipp_request.deleted = :deleted`,
    {deleted: false}
  )

  if (hasPermission(req.user.role, 'canViewAllHippRequests')) {
    // then no additional where clauses
  } else if (hasPermission(req.user.role, 'canViewOrgHippRequests')) {
    // need to filter list to include only hipp requests that include the
    // org this user is assigned.
    hippRequestQuery = hippRequestQuery
    .innerJoin("hipp_request.requestingAgencies", "organisation")
    .andWhere(
      `organisation.id = :orgId`,
      {orgId: req.user.organisation.id}
    )
  } else {
    let err = boom.forbidden(
      `Missing permission required to list HIPP Requests`);
    throw err;
  }

  hippRequestQuery = hippRequestQuery.orderBy("hipp_request.name")

  const hippRequests = await hippRequestQuery.getMany()
  return res.json(hippRequests);
}));


// gets a single HIPP Request
router.get(
  '/:id',
  [
    isAuthenticated,
    permitOrgBasedPermission({
      entityType:HippRequest,
      organisationAttributes: ['requestingAgencies'],
      allowedPermissionAll: 'canViewAllHippRequests',
      allowedPermissionOrg: 'canViewOrgHippRequests'})
  ],
  asyncMiddleware(async function (req, res) {

  let hippRequest = await getConnection()
  .getRepository(HippRequest)
  .findOne(
    req.params.id,
    {
      relations: [
        "requestingAgencies",
      ]
    }
  );

  if (!hippRequest || hippRequest.deleted) {
    let err = boom.notFound(
      `HippRequest ${req.params.id} does not exist`);
    throw err;
  }

  // don't return the deleted flag
  delete hippRequest.deleted;

  return res.json(hippRequest);
}));


// creates a new organisation
router.post(
  '/',
  [
    isAuthenticated,
    permitOrgBasedPermission({
      entityType: HippRequest,
      organisationAttributes: ['requestingAgencies'],
      allowedPermissionAll: 'canEditAllHippRequests',
      allowedPermissionOrg: 'canEditOrgHippRequests',
      allowedPermissionNoEntityId: 'canAddHippRequest',
    })
  ],
  asyncMiddleware(async function (req, res) {

  var hippRequest = new HippRequest()
  _.merge(hippRequest, req.body)

  if (!_.isNil(req.body.areaOfInterest)) {
    let geojson = geojsonToMultiPolygon(req.body.areaOfInterest)
    hippRequest.areaOfInterest = geojson
  }


  hippRequest = await getConnection()
  .getRepository(HippRequest)
  .save(hippRequest)

  // because the saved version of org doesn't include all attribs
  hippRequest = await getConnection()
  .getRepository(HippRequest)
  .findOne(
    hippRequest.id,
    {
      relations: [
        "requestingAgencies",
      ]
    }
  )
  return res.json(hippRequest)
}));


module.exports = router;
