var express = require('express');
var _ = require('lodash');
import * as Boom from '@hapi/boom';
import { feature, featureCollection } from "@turf/helpers";

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated, geojsonToMultiPolygon, hasPermission,
  permitCustodianBasedPermission } from '../utils';
import { SurveyRequest, SURVEY_QUALITY_REQUIREMENTS,
  CHART_PRODUCT_QUALITY_IMPACT_REQUIREMENTS, RISK_MATRIX}
  from '../../lib/entity/survey-request';
import { SurveyPlan } from '../../lib/entity/survey-plan';
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

const surveyRequestRelations = [
  "custodians",
  "organisation",
  "organisations",
  "purposes",
  "dataCaptureTypes",
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

// Gets a list of Survey Requests
router.get('/', isAuthenticated, asyncMiddleware(async function (req, res) {

  let { includeGeometry } = req.query;
  includeGeometry = _.isNil(includeGeometry) ? 'false' : includeGeometry;
  includeGeometry = (includeGeometry == 'true'); // convert string to bool

  let surveyRequestQuery = getConnection()
  .getRepository(SurveyRequest)
  .createQueryBuilder("survey_request")
  .select(["survey_request.id", "survey_request.name",
    "survey_request.requestDateStart", "survey_request.requestDateEnd"])
  .where(
    `survey_request.deleted = :deleted`,
    {deleted: false}
  )

  if (includeGeometry) {
    surveyRequestQuery = surveyRequestQuery
    .addSelect("survey_request.areaOfInterest")
  }

  if (hasPermission(req.user.role, 'canViewAllSurveyRequests')) {
    // then no additional where clauses
  } else if (hasPermission(req.user.role, 'canViewCustodianSurveyRequests')) {
    // need to filter list to include only hipp requests that include the
    // custodian this user is assigned.
    surveyRequestQuery = surveyRequestQuery
    .innerJoin("survey_request.custodians", "custodian")
    .andWhere(
      `(custodian.id = :custodianId OR survey_request.public = true)`,
      {custodianId: req.user.custodian.id}
    )
  } else {
    return res.json([]);
    // let err = Boom.forbidden(
    //   `Missing permission required to list HIPP Requests`);
    // throw err;
  }

  surveyRequestQuery = surveyRequestQuery.orderBy("survey_request.name")

  const surveyRequests = await surveyRequestQuery.getMany()
  return res.json(surveyRequests);
}));


// gets a single HIPP Request
router.get(
  '/:id/geometry',
  [
    isAuthenticated,
    permitCustodianBasedPermission({
      overrideFlag:'public',
      entityType:SurveyRequest,
      custodianAttributes: ['custodians'],
      allowedPermissionAll: 'canViewAllSurveyRequests',
      allowedPermissionCustodian: 'canViewCustodianSurveyRequests'})
  ],
  asyncMiddleware(async function (req, res) {

  let surveyRequest = await getConnection()
  .getRepository(SurveyRequest)
  .findOne(
    req.params.id,
    {
      relations: [
        "custodians",
      ]
    }
  );

  if (!surveyRequest || surveyRequest.deleted) {
    let err = Boom.notFound(
      `SurveyRequest ${req.params.id} does not exist`);
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
    if (_.has(surveyRequest, entityAttribName)) {
      attribValue = _.get(surveyRequest, entityAttribName)
    }
    properties[gjAttribName] = attribValue
  }

  const aoiMultipolygon = surveyRequest.areaOfInterest;
  const aoiFeature = feature(aoiMultipolygon, properties);

  const collection = featureCollection([
    aoiFeature,
  ]);

  let areaName = _.isNil(surveyRequest.name) ? 'request' : surveyRequest.name
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
      overrideFlag:'public',
      entityType:SurveyRequest,
      custodianAttributes: ['custodians'],
      allowedPermissionAll: 'canViewAllSurveyRequests',
      allowedPermissionCustodian: 'canViewCustodianSurveyRequests'})
  ],
  asyncMiddleware(async function (req, res) {

  let surveyRequest = await getConnection()
  .getRepository(SurveyRequest)
  .findOne(
    req.params.id,
    {
      relations: surveyRequestRelations
    }
  );

  if (!surveyRequest || surveyRequest.deleted) {
    let err = Boom.notFound(
      `SurveyRequest ${req.params.id} does not exist`);
    throw err;
  }

  // don't return the deleted flag
  delete surveyRequest.deleted;

  return res.json(surveyRequest);
}));


// updates the list of linked plans
router.post(
  '/:id/linked-plans',
  [
    isAuthenticated,
    permitCustodianBasedPermission({
      entityType: SurveyRequest,
      custodianAttributes: ['custodians'],
      allowedPermissionAll: 'canEditAllSurveyRequests',
      allowedPermissionCustodian: 'canEditCustodianSurveyRequests',
      allowedPermissionNoEntityId: 'canAddSurveyRequest',
    })
  ],
  asyncMiddleware(async function (req, res) {

  // Note: this doesn't change the HIPP Request itself, only the project
  // metadatas linked to it.

  const hrRepo = getConnection().getRepository(SurveyRequest);
  const planRepo = getConnection().getRepository(SurveyPlan);

  let hr = await hrRepo.findOne(req.params.id);

  if (!hr) {
    let err = Boom.notFound(
      `SurveyRequest ${req.params.id} does not exist, cannot update`);
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
            "surveyRequest",
          ]
        }
      );

      if (!entityPlan) {
        let err = Boom.notFound(`SurveyPlan ${plan.id} does not exist, ` +
          `cannot update link to request`);
        throw err;
      }

      if (plan.linked) {
        if (_.isNil(entityPlan.surveyRequest)) {
          newLinkedCount += 1
        } else if (entityPlan.surveyRequest.id != hr.id) {
          reLinkedCount += 1
        }

        entityPlan.surveyRequest = hr
      } else {
        if (!_.isNil(entityPlan.surveyRequest)) {
          removeLinkedCount += 1
        }
        entityPlan.surveyRequest = null
      }

      await getConnection()
      .getRepository(SurveyPlan)
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
      entityType: SurveyRequest,
      custodianAttributes: ['custodians'],
      allowedPermissionAll: 'canEditAllSurveyRequests',
      allowedPermissionCustodian: 'canEditCustodianSurveyRequests',
      allowedPermissionNoEntityId: 'canAddSurveyRequest',
    })
  ],
  asyncMiddleware(async function (req, res) {

  var surveyRequest = new SurveyRequest()
  _.merge(surveyRequest, req.body)

  // DO NOT update the record state here. Record state changes should only
  // happen in the record state handlers
  delete surveyRequest.recordState

  if (!_.isNil(req.body.areaOfInterest)) {
    let geojson = geojsonToMultiPolygon(req.body.areaOfInterest)
    surveyRequest.areaOfInterest = geojson
  }

  // TODO fix below, would be nice to add record state when creating new record
  // But it is not required.
  // const changeDesc = _.isNil(req.body.id) ? "New record" : "Updated record"
  // const recordState = await updateRecordState(
  //   SurveyRequest, req.body.id, req.user, 'request', changeDesc);
  //
  // surveyRequest.recordState = recordState

  surveyRequest.deleted = false

  surveyRequest = await getConnection()
  .getRepository(SurveyRequest)
  .save(surveyRequest)

  // because the saved version of custodian doesn't include all attribs
  surveyRequest = await getConnection()
  .getRepository(SurveyRequest)
  .findOne(
    surveyRequest.id,
    {
      relations: surveyRequestRelations
    }
  )
  return res.json(surveyRequest)
}));


router.delete(
  '/:id',
  [
    isAuthenticated,
    permitCustodianBasedPermission({
      entityType: SurveyRequest,
      custodianAttributes: ['custodians'],
      allowedPermissionAll: 'canEditAllSurveyRequests',
      allowedPermissionCustodian: 'canEditCustodianSurveyRequests',
      allowedPermissionNoEntityId: 'canAddSurveyRequest',
    })
  ],
  asyncMiddleware(async function (req, res) {

  const hrRepo = getConnection().getRepository(SurveyRequest);

  let hr = await hrRepo.findOne(req.params.id);

  if (!hr) {
    let err = Boom.notFound(
      `SurveyRequest ${req.params.id} does not exist, cannot delete`);
    throw err;
  }

  hr.deleted = true;
  hr = await hrRepo.save(hr);

  const responseSuccess = { success : 'Deleted'};
  return res.json(responseSuccess);
}));


module.exports = router;
