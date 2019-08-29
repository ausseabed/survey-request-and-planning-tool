var express = require('express');
var _ = require('lodash');
const boom = require('boom');
import { feature, featureCollection } from "@turf/helpers";

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated, geojsonToMultiPolygon,
  hasPermission, permitCustodianBasedPermission }
  from '../utils';
import { ProjectMetadata, SURVEY_PLAN_STATUSES }
  from '../../lib/entity/project-metadata';
import { SurveyApplication } from '../../lib/entity/survey-application';
import { TechSpec } from '../../lib/entity/tech-spec';


var router = express.Router();

// Gets a list of project metadata
router.get('/valid-statuses', async function (req, res) {
  return res.json(SURVEY_PLAN_STATUSES);
});

// Gets a list of project metadata
router.get('/', isAuthenticated, asyncMiddleware(async function (req, res) {

  let { includeGeometry } = req.query;
  includeGeometry = _.isNil(includeGeometry) ? 'false' : includeGeometry;
  includeGeometry = (includeGeometry == 'true'); // convert string to bool

  let projectsQuery = getConnection()
  .getRepository(ProjectMetadata)
  .createQueryBuilder("project_metadata")
  .select(["project_metadata.id", "project_metadata.surveyName",
    "project_metadata.startDate", "project_metadata.status"])
  .leftJoinAndSelect("project_metadata.recordState", "record_state")
  .leftJoin("project_metadata.surveyRequest", "hipp_request")
  .addSelect("hipp_request.id")

  if (includeGeometry) {
    projectsQuery = projectsQuery.addSelect("project_metadata.areaOfInterest")
  }

  projectsQuery = projectsQuery
  .where(
    `project_metadata.deleted = :deleted`,
    {deleted: false}
  )
  .orderBy("project_metadata.surveyName")
  if (!_.isNil(req.query['hipp-request'])) {
    projectsQuery = projectsQuery.andWhere(`"project_metadata"."surveyRequestId" = :hrid`,
      {hrid: req.query['hipp-request']})
  }

  if (hasPermission(req.user.role, 'canViewAllSurveyPlans')) {
    // then no additional where clauses
  } else if (hasPermission(req.user.role, 'canViewCustodianSurveyPlans')) {
    // need to filter list to include only projects that include the
    // custodian this user is assigned.
    projectsQuery = projectsQuery
    .innerJoin("project_metadata.custodians", "custodian")
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

  let projects = await projectsQuery.getMany();

  return res.json(projects);
}));


router.get(
  '/:id/thumbnail',
  [
    isAuthenticated,
    permitCustodianBasedPermission({
      entityType:ProjectMetadata,
      custodianAttributes: ['custodians'],
      allowedPermissionAll: 'canViewAllSurveyPlans',
      allowedPermissionCustodian: 'canViewCustodianSurveyPlans'})
  ],
  asyncMiddleware(async function (req, res) {

  const extents = await getConnection()
  .createQueryBuilder()
  .select([`ST_XMin("extent")`, `ST_XMax("extent")`, `ST_YMin("extent")`, `ST_YMax("extent")`])
  .from(subQuery => {
      return subQuery
          .select('ST_Extent("areaOfInterest")', 'extent')
          .from(ProjectMetadata)
          .where(`"id" = :id`, { id: req.params.id });
  }, "extent")
  .getRawOne();

  let center = {
    x: (extents.st_xmax + extents.st_xmin)/2,
    y: (extents.st_ymax + extents.st_ymin)/2
  }
  let dX = extents.st_xmax - extents.st_xmin
  let dY = extents.st_ymax - extents.st_ymin
  let maxDelta = dX > dY ? dX : dY
  let newExtents = {
    minX: center.x - maxDelta/2,
    maxX: center.x + maxDelta/2,
    minY: center.y - maxDelta/2,
    maxY: center.y + maxDelta/2,
  }

  let rasterSize = 800
  let scale = maxDelta / rasterSize
  // let projectImage = await getConnection()
  // .getRepository(ProjectMetadata)
  // .createQueryBuilder("project_metadata")
  // .select(`ST_MakeEmptyRaster(${rasterSize},${rasterSize},${newExtents.minX}, ${newExtents.maxY}, ${scale}, ${scale}, 0,0,4326)`, 'imageData')
  // .where(`"project_metadata"."id" = :id`, {id: req.params.id})
  // .getRawOne();

  let nrq = `ST_MakeEmptyRaster(${rasterSize},${rasterSize},${newExtents.minX}, ${newExtents.maxY}, ${scale}, ${-1*scale}, 0,0,4326)`

  let projectImage = await getConnection()
  .getRepository(ProjectMetadata)
  .createQueryBuilder()
  .select(`ST_AsPNG(ST_AsRaster("areaOfInterest",${nrq},ARRAY[\'8BUI\', \'8BUI\', \'8BUI\'], ARRAY[97, 173, 216], ARRAY[255,255,255]))`, 'imageData')
  .where(`"id" = :id`, {id: req.params.id})
  .getRawOne();

  // let projectImage = await getConnection()
  // .getRepository(ProjectMetadata)
  // .createQueryBuilder("project_metadata")
  // .select(`ST_AsPNG(ST_AsRaster(ST_Buffer(ST_Boundary("project_metadata"."areaOfInterest"), 0.02,\'join=round\'),${nrq},ARRAY[\'8BUI\', \'8BUI\', \'8BUI\'], ARRAY[118,154,118], ARRAY[255,255,255]))`, 'imageData')
  // .where(`"project_metadata"."id" = :id`, {id: req.params.id})
  // .getRawOne();


  // let projectExtent = await getConnection()
  // .getRepository(ProjectMetadata)
  // .createQueryBuilder("project_metadata")
  // .select('ST_Extent("project_metadata"."areaOfInterest")', 'extent')
  // .where(`"project_metadata"."id" = :id`, {id: req.params.id})
  // .getRawOne();
  // console.log(projectExtent)


  // let projectImage = await getConnection()
  // .getRepository(ProjectMetadata)
  // .createQueryBuilder("project_metadata")
  // .select('ST_AsPNG(ST_AsRaster(ST_Buffer(ST_Boundary("project_metadata"."areaOfInterest"), 0.02,\'join=round\'),400,400,ARRAY[\'8BUI\', \'8BUI\', \'8BUI\'], ARRAY[118,154,118], ARRAY[255,255,255]))', 'imageData')
  // .where(`"project_metadata"."id" = :id`, {id: req.params.id})
  // .getRawOne();

  res.writeHead(200, {'Content-Type': 'image/png' });
  res.end(projectImage.imageData, 'binary');
}))


// download the geojson for the area of interest
router.get(
  '/:id/geometry',
  [
    isAuthenticated,
    permitCustodianBasedPermission({
      entityType:ProjectMetadata,
      custodianAttributes: ['custodians'],
      allowedPermissionAll: 'canEditAllSurveyPlans',
      allowedPermissionCustodian: 'canEditCustodianSurveyPlans',
      allowedPermissionNoEntityId: 'canAddSurveyPlan',
    })
  ],
  asyncMiddleware(async function (req, res) {

  let plan = await getConnection()
  .getRepository(ProjectMetadata)
  .findOne(
    req.params.id,
    {
      relations: [
        "custodians",
      ]
    }
  );

  if (!plan || plan.deleted) {
    let err = boom.notFound(
      `Plan ${req.params.id} does not exist`);
    throw err;
  }

  const aoiMultipolygon = plan.areaOfInterest;
  const aoiFeature = feature(aoiMultipolygon);

  const collection = featureCollection([
    aoiFeature,
  ]);

  let filename = _.isNil(plan.surveyName) ? 'plan' : plan.surveyName
  filename = filename.replace(/[^a-zA-Z0-9 ]*/g, "")   // remove special chars
  filename = filename.replace(/ /g, "-")   // replace spaces with dash
  filename = `${filename}-asb-rapt-download.json`;
  res.set(
    'Content-disposition', `attachment; filename=${filename}`);
  return res.json(collection);
}));


// gets a single project metadata
router.get(
  '/:id',
  [
    isAuthenticated,
    permitCustodianBasedPermission({
      entityType:ProjectMetadata,
      custodianAttributes: ['custodians'],
      allowedPermissionAll: 'canViewAllSurveyPlans',
      allowedPermissionCustodian: 'canViewCustodianSurveyPlans'})
  ],
  asyncMiddleware(async function (req, res) {
  let project = await getConnection()
  .getRepository(ProjectMetadata)
  .findOne(
    req.params.id,
    {
      relations: [
        "custodians",
        "organisations",
        "instrumentTypes",
        "dataCaptureTypes",
        "surveyApplication",
        "surveyRequest",
      ]
    }
  );

  if (!project || project.deleted) {
    let err = boom.notFound(
      `ProjectMetadata ${req.params.id} does not exist`);
    throw err;
  }

  // don't return the deleted flag
  delete project.deleted;

  return res.json(project);
}));


// create new project metadata
router.post(
  '/',
  [
    isAuthenticated,
    permitCustodianBasedPermission({
      entityType:ProjectMetadata,
      custodianAttributes: ['custodians'],
      allowedPermissionAll: 'canEditAllSurveyPlans',
      allowedPermissionCustodian: 'canEditCustodianSurveyPlans',
      allowedPermissionNoEntityId: 'canAddSurveyPlan',
    })
  ],
  asyncMiddleware(async function (req, res) {

  var project = new ProjectMetadata()
  if (req.body.id) {
    project.id = req.body.id;
  }
  project.surveyName = req.body.surveyName
  project.contactPerson = req.body.contactPerson;
  project.email = req.body.email;
  project.custodians = req.body.custodians;
  project.organisations = req.body.organisations;
  project.startDate = req.body.startDate;
  project.endDate = req.body.endDate;
  project.instrumentTypes = req.body.instrumentTypes;
  project.dataCaptureTypes = req.body.dataCaptureTypes;

  let surveyApp = req.body.surveyApplication;
  if (!_.isNil(surveyApp) && surveyApp.userSubmitted) {
    surveyApp = await getConnection()
    .getRepository(SurveyApplication)
    .save(surveyApp);
  }
  project.surveyApplication = surveyApp;


  if (!_.isNil(req.body.status)) {
    const status = req.body.status
    if (!SURVEY_PLAN_STATUSES.includes(status)) {
      let err = boom.badRequest(`Bad status "${status}", must be one of\
        ${SURVEY_PLAN_STATUSES.join(', ')}`);
      throw err;
    }
    project.status = status;
  }
  project.comment = req.body.comment;
  project.quality = req.body.quality;
  project.vessel = req.body.vessel;

  project.contractNumber = req.body.contractNumber;
  project.surveyId = req.body.surveyId;
  project.tenderer = req.body.tenderer;
  project.surveyors = req.body.surveyors;

  project.hasMoratorium = req.body.hasMoratorium;
  project.moratoriumDate = req.body.moratoriumDate;

  if (_.isNil(project.id)) {
    // only set hipp request if it is a new project. Otherwise
    // it must be linked via the survey request plans form.
    project.surveyRequest = req.body.surveyRequest;
  }

  if (!_.isNil(req.body.areaOfInterest)) {
    let geojson = geojsonToMultiPolygon(req.body.areaOfInterest);
    project.areaOfInterest = geojson;
  }

  // don't let the post request mark a project as deleted
  delete project.deleted;

  project = await getConnection()
  .getRepository(ProjectMetadata)
  .save(project)

  return res.json(project)
}));


router.delete(
  '/:id',
  [
    isAuthenticated,
    permitCustodianBasedPermission({
      entityType:ProjectMetadata,
      custodianAttributes: ['custodians'],
      allowedPermissionAll: 'canEditAllSurveyPlans',
      allowedPermissionCustodian: 'canEditCustodianSurveyPlans',
    })
  ],
  asyncMiddleware(async function (req, res) {

  const projMetaRepo = getConnection().getRepository(ProjectMetadata);
  const techSpecRepo = getConnection().getRepository(TechSpec);

  let project = await projMetaRepo.findOne(req.params.id);

  if (!project) {
    let err = boom.notFound(
      `ProjectMetadata ${req.params.id} does not exist, cannot delete`);
    throw err;
  }

  project.deleted = true;
  project = await projMetaRepo.save(project);

  let techSpec = await techSpecRepo.findOne(req.params.id);
  if (techSpec) {
    // a project metadata entry can exist without a tech-spec, but not the
    // other way around.
    techSpec.deleted = true;
    techSpec = await techSpecRepo.save(techSpec);
  }

  const responseSuccess = { success : 'Deleted'};
  return res.json(responseSuccess);
}));

module.exports = router;
