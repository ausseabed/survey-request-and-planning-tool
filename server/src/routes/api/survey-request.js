var express = require('express');
var _ = require('lodash');
import * as Boom from '@hapi/boom';
import { feature, featureCollection } from "@turf/helpers";

var archiver = require('archiver')
var p = require('path')
const fs = require('fs')

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated, geojsonToMultiPolygon, hasPermission,
  permitCustodianBasedPermission } from '../utils';
import { SurveyRequest } from '../../lib/entity/survey-request';
import { SurveyRequestAoi } from '../../lib/entity/survey-request-aoi';
import { SurveyPlan } from '../../lib/entity/survey-plan';
import { updateRecordState } from '../state-management';
import { RecordState } from '../../lib/entity/record-state';
import { shpBuilderFactory } from '../../lib/shp-builder';

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

async function getSurveyRequest(id) {
  // function a little more complicated that a simple `.findOne` as we
  // need to support ordering of the area of interests
  let surveyRequest = await getConnection()
  .getRepository(SurveyRequest)
  .createQueryBuilder("survey_request")
  .leftJoinAndSelect("survey_request.custodians", "custodian")
  .leftJoinAndSelect("survey_request.organisation", "organisation")
  .leftJoinAndSelect("survey_request.organisations", "organisations")
  .leftJoinAndSelect("survey_request.businessCaseAttachment", "attachment")
  .leftJoinAndSelect("survey_request.aois", "survey_request_aoi")
  .where("survey_request.id = :id", { id: id })
  .orderBy({
      // 'survey_request_aoi.name': 'ASC',
      'survey_request_aoi.counter': 'ASC'
  })
  .getOne();

  return surveyRequest;
}


var router = express.Router();

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
  '/:id/shp',
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

  const shpBuilder = shpBuilderFactory('request')
  const tmpDir = shpBuilder.build(surveyRequest.id, surveyRequest.name)

  res.on('finish', () => {
    // delete the contents of the temp direstory now that the data has been
    // downloaded
    tmpDir.removeCallback()
  });

  // from https://github.com/archiverjs/node-archiver/blob/master/examples/express.js
  var archive = archiver('zip');

  archive.on('error', function(err) {
    res.status(500).send({error: err.message});
  });

  //on stream closed we can end the request
  archive.on('end', function() {
    console.log('Zipped %d bytes', archive.pointer());
  });

  //set the archive name
  res.attachment(`${surveyRequest.name}.zip`);

  //this is the streaming magic
  archive.pipe(res);

  var files = fs.readdirSync(tmpDir.name).map((fn) => { return `${tmpDir.name}/${fn}`})
  console.log(files)

  for(var i in files) {
    archive.file(files[i], { name: p.basename(files[i]) });
  }

  archive.finalize();
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

  let surveyRequest = await getSurveyRequest(req.params.id);

  if (!surveyRequest || surveyRequest.deleted) {
    let err = Boom.notFound(
      `SurveyRequest ${req.params.id} does not exist`);
    throw err;
  }

  // don't return the deleted flag
  delete surveyRequest.deleted;

  return res.json(surveyRequest);
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

  surveyRequest.deleted = false

  // Remove the link between the upload processing task and this SR. It is
  // assumed that by saving the user has reviewed all processed survey requests
  // and included/edited those they want linked to this sr (and have been
  // included in the post body).
  surveyRequest.uploadTaskId = null;

  await getConnection().transaction(async transactionalEntityManager => {
    const isNew = _.isNil(surveyRequest.id);
    if (isNew) {
      surveyRequest = await getConnection()
      .getRepository(SurveyRequest)
      .save(surveyRequest)

      const message = `Created new Survey Request`;
      const recordState = new RecordState();
      recordState.changeDescription = message;
      recordState.state = 'drafted';
      recordState.previous = undefined;
      recordState.user = req.user;
      recordState.created = Date.now();
      recordState.recordType = 'survey request';
      recordState.version = 1;
      recordState.recordId = surveyRequest.id;
      surveyRequest.recordState = recordState;
    }

    surveyRequest = await getConnection()
    .getRepository(SurveyRequest)
    .save(surveyRequest)
  });

  // because the saved version of custodian doesn't include all attribs
  surveyRequest = await getSurveyRequest(surveyRequest.id);
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
