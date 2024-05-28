var express = require('express');
var _ = require('lodash');
import * as Boom from '@hapi/boom';
import { feature, featureCollection } from "@turf/helpers";

var archiver = require('archiver')
var p = require('path')
const fs = require('fs')

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated, geojsonToMultiPolygon, hasPermission,
  permitCustodianBasedPermission, sanitizeForFilename } from '../utils';
import { SurveyRequest } from '../../lib/entity/survey-request';
import { SurveyRequestAoi } from '../../lib/entity/survey-request-aoi';
import { SurveyPlan } from '../../lib/entity/survey-plan';
import { updateRecordState } from '../state-management';
import { RecordState } from '../../lib/entity/record-state';
import { shpBuilderFactory } from '../../lib/shp-builder';


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

// Gets a list of Survey Requests
router.get('/', isAuthenticated, asyncMiddleware(async function (req, res) {

  let { includeGeometry } = req.query;
  includeGeometry = _.isNil(includeGeometry) ? 'false' : includeGeometry;
  includeGeometry = (includeGeometry == 'true'); // convert string to bool

  let surveyRequestQuery = getConnection()
  .getRepository(SurveyRequest)
  .createQueryBuilder("survey_request")
  .select(["survey_request.id", "survey_request.name"])
  .leftJoinAndSelect("survey_request.organisation", "organisation")
  .leftJoinAndSelect("survey_request.recordState", "recordState")
  .where(
    `survey_request.deleted = :deleted`,
    {deleted: false}
  )

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

  surveyRequestQuery = surveyRequestQuery
  .orderBy("recordState.created", "DESC")

  const surveyRequests = await surveyRequestQuery.getMany()
  return res.json(surveyRequests);
}));


// // gets geojson for all requests
// router.get('/geometry-old', isAuthenticated, asyncMiddleware(async function (req, res) {
//
//   // WARNING: This will only work when connected up to postgis v3.0
//   // and this is currently not the case
//
//   const pas2 = await getConnection()
//   .createQueryBuilder()
//   .select([`ST_AsGeoJSON(geom_query, 'sra_geom') as geojson`])
//   .from(subQuery => {
//     return subQuery
//     .select([
//       "survey_request.id as sr_id",
//       "survey_request.name as sr_name",
//       "survey_request_aoi.id as sra_id",
//       "survey_request_aoi.name as sra_name",
//       "survey_request_aoi.geom as sra_geom"
//     ])
//     .from("survey_request_aoi")
//     .innerJoin("survey_request_aoi.surveyRequest", "survey_request")
//     .where(
//       `survey_request.deleted = :deleted`,
//       {deleted: false}
//     );
//   }, "geom_query")
//   .getRawOne();
//
//   res.set('Content-Type', 'application/json');
//   return res.send(pas2.geojson);
//
// }));


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

  let { simplify } = req.query;
  simplify = _.isNil(simplify) || !(simplify === 'true') ? false : true;

  let sr = await getConnection()
  .getRepository(SurveyRequest)
  .findOne(req.params.id);

  if (!sr) {
    let err = Boom.notFound(
      `SurveyRequest ${req.params.id} does not exist`);
    throw err;
  }

  const geom_select = simplify ? `ST_Simplify(geom, 0.05)` : `geom`

  const sr2 = await getConnection()
  .createQueryBuilder()
  .select([`ST_AsGeoJSON(ST_Collect("extent")) as geojson`])
  .from(subQuery => {
    return subQuery
      .select(geom_select, 'extent')
      .addSelect(`name`, 'name')
      .from('survey_request_aoi')
      .where(`"survey_request_id" = :id`, { id: req.params.id });
  }, "extent")
  .getRawOne();

  res.set('Content-Type', 'application/json');
  return res.send(sr2.geojson);

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

  const shpFilename = sanitizeForFilename(surveyRequest.name)
  const shpBuilder = shpBuilderFactory('request')
  const tmpDir = shpBuilder.build(surveyRequest.id, shpFilename)

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
  res.attachment(`${shpFilename}.zip`);

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
