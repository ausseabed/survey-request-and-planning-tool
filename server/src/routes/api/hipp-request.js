var express = require('express');
var _ = require('lodash');
const boom = require('boom');
import { feature, featureCollection } from "@turf/helpers";

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated, geojsonToMultiPolygon, hasPermission,
  permitCustodianBasedPermission } from '../utils';
import { HippRequest, SURVEY_QUALITY_REQUIREMENTS,
  CHART_PRODUCT_QUALITY_IMPACT_REQUIREMENTS, RISK_MATRIX}
  from '../../lib/entity/hipp-request';
import { ProjectMetadata } from '../../lib/entity/project-metadata';
import { updateRecordState } from '../state-management';

// mapping of the entity attribute names to what they should be in the
// exported geojson
var ENTITY_GEOJSON_MAP = [
  ['custodians[0].name', 'ORGANISATN'],
  ['requestorName', 'NAME'],
  ['requestorPosition', 'POSITION'],
  ['pointOfContactPhone', 'PHONE'],
  ['pointOfContactEmail', 'EMAIL'],
  ['recordState.created', 'REQ_DATE'],
  ['pointOfContactEmail', 'EMAIL'],
  ['name', 'TITLE'],
  ['businessJustification', 'COMMNT_TXT'],
  ['comments', 'REQOR_COMM'],
];


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

router.get('/geojson-attribute-map', async function (req, res) {
  return res.json(ENTITY_GEOJSON_MAP);
});

// Gets a list of HIPP Requests
router.get('/', isAuthenticated, asyncMiddleware(async function (req, res) {

  let hippRequestQuery = getConnection()
  .getRepository(HippRequest)
  .createQueryBuilder("hipp_request")
  .select(["hipp_request.id", "hipp_request.name",
    "hipp_request.requestDateStart", "hipp_request.requestDateEnd"])
  .where(
    `hipp_request.deleted = :deleted`,
    {deleted: false}
  )

  if (hasPermission(req.user.role, 'canViewAllSurveyRequests')) {
    // then no additional where clauses
  } else if (hasPermission(req.user.role, 'canViewCustodianSurveyRequests')) {
    // need to filter list to include only hipp requests that include the
    // custodian this user is assigned.
    hippRequestQuery = hippRequestQuery
    .innerJoin("hipp_request.custodians", "custodian")
    .andWhere(
      `custodian.id = :custodianId`,
      {custodianId: req.user.custodian.id}
    )
  } else {
    return res.json([]);
    // let err = boom.forbidden(
    //   `Missing permission required to list HIPP Requests`);
    // throw err;
  }

  hippRequestQuery = hippRequestQuery.orderBy("hipp_request.name")

  const hippRequests = await hippRequestQuery.getMany()
  return res.json(hippRequests);
}));


// gets a single HIPP Request
router.get(
  '/:id/geometry',
  [
    isAuthenticated,
    permitCustodianBasedPermission({
      entityType:HippRequest,
      custodianAttributes: ['custodians'],
      allowedPermissionAll: 'canViewAllSurveyRequests',
      allowedPermissionCustodian: 'canViewCustodianSurveyRequests'})
  ],
  asyncMiddleware(async function (req, res) {

  let hippRequest = await getConnection()
  .getRepository(HippRequest)
  .findOne(
    req.params.id,
    {
      relations: [
        "custodians",
      ]
    }
  );

  if (!hippRequest || hippRequest.deleted) {
    let err = boom.notFound(
      `HippRequest ${req.params.id} does not exist`);
    throw err;
  }

  // feature prop dict based on entity values to be returned in the geojson.
  const properties = {}

  // Translate the entity attribute names to the AHO db names using the mapping
  // array.
  for (const etj of ENTITY_GEOJSON_MAP) {
    const entityAttribName = etj[0];
    const gjAttribName = etj[1];
    let attribValue = undefined;
    if (_.has(hippRequest, entityAttribName)) {
      attribValue = _.get(hippRequest, entityAttribName)
    }
    properties[gjAttribName] = attribValue
  }

  const aoiMultipolygon = hippRequest.areaOfInterest;
  const aoiFeature = feature(aoiMultipolygon, properties);

  const collection = featureCollection([
    aoiFeature,
  ]);

  let areaName = _.isNil(hippRequest.name) ? 'request' : hippRequest.name
  areaName = areaName.replace(/[^a-zA-Z0-9 ]*/g, "")   // remove special chars
  areaName = areaName.replace(/ /g, "-")   // replace spaces with dash
  const filename = `${areaName}-asb-rapt-download.json`;
  res.set(
    'Content-disposition', `attachment; filename=${filename}`);
  return res.json(collection);
}));


// gets a single HIPP Request
router.get(
  '/:id',
  [
    isAuthenticated,
    permitCustodianBasedPermission({
      entityType:HippRequest,
      custodianAttributes: ['custodians'],
      allowedPermissionAll: 'canViewAllSurveyRequests',
      allowedPermissionCustodian: 'canViewCustodianSurveyRequests'})
  ],
  asyncMiddleware(async function (req, res) {

  let hippRequest = await getConnection()
  .getRepository(HippRequest)
  .findOne(
    req.params.id,
    {
      relations: [
        "custodians",
        "organisations",
        "purposes",
        "dataCaptureTypes",
        "recordState"
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


// updates the list of linked plans
router.post(
  '/:id/linked-plans',
  [
    isAuthenticated,
    permitCustodianBasedPermission({
      entityType: HippRequest,
      custodianAttributes: ['custodians'],
      allowedPermissionAll: 'canEditAllSurveyRequests',
      allowedPermissionCustodian: 'canEditCustodianSurveyRequests',
      allowedPermissionNoEntityId: 'canAddSurveyRequest',
    })
  ],
  asyncMiddleware(async function (req, res) {

  // Note: this doesn't change the HIPP Request itself, only the project
  // metadatas linked to it.

  const hrRepo = getConnection().getRepository(HippRequest);
  const planRepo = getConnection().getRepository(ProjectMetadata);

  let hr = await hrRepo.findOne(req.params.id);

  if (!hr) {
    let err = boom.notFound(
      `HippRequest ${req.params.id} does not exist, cannot update`);
    throw err;
  }

  const linkedPlans = req.body

  // count changes in link status to provide meaningful feedback to users
  let newLinkedCount = 0
  let reLinkedCount = 0
  let removeLinkedCount = 0
  await getConnection().transaction(async transactionalEntityManager => {
    for (const plan of linkedPlans) {
      let entityPlan = await planRepo.findOne(
        plan.id,
        {
          relations: [
            "hippRequest",
          ]
        }
      );

      if (!entityPlan) {
        let err = boom.notFound(`ProjectMetadata ${plan.id} does not exist, ` +
          `cannot update link to request`);
        throw err;
      }

      if (plan.linked) {
        if (_.isNil(entityPlan.hippRequest)) {
          newLinkedCount += 1
        } else if (entityPlan.hippRequest.id != hr.id) {
          reLinkedCount += 1
        }

        entityPlan.hippRequest = hr
      } else {
        if (!_.isNil(entityPlan.hippRequest)) {
          removeLinkedCount += 1
        }
        entityPlan.hippRequest = null
      }

      await getConnection()
      .getRepository(ProjectMetadata)
      .save(entityPlan)

    }

  })

  const responseSuccess = {
    newLinkedCount: newLinkedCount,
    reLinkedCount: reLinkedCount,
    removeLinkedCount: removeLinkedCount,
  };
  return res.json(responseSuccess);
}));


// creates a new custodian
router.post(
  '/',
  [
    isAuthenticated,
    permitCustodianBasedPermission({
      entityType: HippRequest,
      custodianAttributes: ['custodians'],
      allowedPermissionAll: 'canEditAllSurveyRequests',
      allowedPermissionCustodian: 'canEditCustodianSurveyRequests',
      allowedPermissionNoEntityId: 'canAddSurveyRequest',
    })
  ],
  asyncMiddleware(async function (req, res) {

  var hippRequest = new HippRequest()
  _.merge(hippRequest, req.body)

  // DO NOT update the record state here. Record state changes should only
  // happen in the record state handlers
  delete hippRequest.recordState

  if (!_.isNil(req.body.areaOfInterest)) {
    let geojson = geojsonToMultiPolygon(req.body.areaOfInterest)
    hippRequest.areaOfInterest = geojson
  }

  // TODO fix below, would be nice to add record state when creating new record
  // But it is not required.
  // const changeDesc = _.isNil(req.body.id) ? "New record" : "Updated record"
  // const recordState = await updateRecordState(
  //   HippRequest, req.body.id, req.user, 'request', changeDesc);
  //
  // hippRequest.recordState = recordState

  hippRequest = await getConnection()
  .getRepository(HippRequest)
  .save(hippRequest)

  // because the saved version of custodian doesn't include all attribs
  hippRequest = await getConnection()
  .getRepository(HippRequest)
  .findOne(
    hippRequest.id,
    {
      relations: [
        "custodians",
        "organisations",
        "purposes",
        "dataCaptureTypes",
      ]
    }
  )
  return res.json(hippRequest)
}));


router.delete(
  '/:id',
  [
    isAuthenticated,
    permitCustodianBasedPermission({
      entityType: HippRequest,
      custodianAttributes: ['custodians'],
      allowedPermissionAll: 'canEditAllSurveyRequests',
      allowedPermissionCustodian: 'canEditCustodianSurveyRequests',
      allowedPermissionNoEntityId: 'canAddSurveyRequest',
    })
  ],
  asyncMiddleware(async function (req, res) {

  const hrRepo = getConnection().getRepository(HippRequest);

  let hr = await hrRepo.findOne(req.params.id);

  if (!hr) {
    let err = boom.notFound(
      `HippRequest ${req.params.id} does not exist, cannot delete`);
    throw err;
  }

  hr.deleted = true;
  hr = await hrRepo.save(hr);

  const responseSuccess = { success : 'Deleted'};
  return res.json(responseSuccess);
}));


module.exports = router;
