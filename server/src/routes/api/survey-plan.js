var express = require('express');
var _ = require('lodash');
import * as Boom from '@hapi/boom';
import { feature, featureCollection, geometryCollection } from "@turf/helpers";

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated, geojsonToMultiPolygon,
  hasPermission, permitCustodianBasedPermission }
  from '../utils';
import { SurveyPlan, SURVEY_PLAN_STATUSES }
  from '../../lib/entity/survey-plan';
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
  .getRepository(SurveyPlan)
  .createQueryBuilder("survey_plan")
  .select(["survey_plan.id", "survey_plan.surveyName",
    "survey_plan.startDate", "survey_plan.status"])
  .leftJoinAndSelect("survey_plan.organisations", "organisations")
  .leftJoinAndSelect("survey_plan.recordState", "record_state")

  if (includeGeometry) {
    projectsQuery = projectsQuery.addSelect("survey_plan.areaOfInterest")
  }

  projectsQuery = projectsQuery
  .where(
    `survey_plan.deleted = :deleted`,
    {deleted: false}
  )
  .orderBy("survey_plan.surveyName")

  if (hasPermission(req.user.role, 'canViewAllSurveyPlans')) {
    // then no additional where clauses
  } else if (hasPermission(req.user.role, 'canViewCustodianSurveyPlans')) {
    // need to filter list to include only projects that include the
    // custodian this user is assigned.
    projectsQuery = projectsQuery
    .innerJoin("survey_plan.custodians", "custodian")
    .andWhere(
      `(custodian.id = :custodianId OR survey_plan.public = true)`,
      {custodianId: req.user.custodian.id}
    )
  } else {
    return res.json([]);
    // let err = Boom.forbidden(
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
      overrideFlag:'public',
      entityType:SurveyPlan,
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
          .select('ST_Extent(area_of_interest)', 'extent')
          .from(SurveyPlan)
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
  // .getRepository(SurveyPlan)
  // .createQueryBuilder("survey_plan")
  // .select(`ST_MakeEmptyRaster(${rasterSize},${rasterSize},${newExtents.minX}, ${newExtents.maxY}, ${scale}, ${scale}, 0,0,4326)`, 'imageData')
  // .where(`"survey_plan"."id" = :id`, {id: req.params.id})
  // .getRawOne();

  let nrq = `ST_MakeEmptyRaster(${rasterSize},${rasterSize},${newExtents.minX}, ${newExtents.maxY}, ${scale}, ${-1*scale}, 0,0,4326)`

  let projectImage = await getConnection()
  .getRepository(SurveyPlan)
  .createQueryBuilder()
  .select(`ST_AsPNG(ST_AsRaster(area_of_interest,${nrq},ARRAY[\'8BUI\', \'8BUI\', \'8BUI\'], ARRAY[97, 173, 216], ARRAY[255,255,255]))`, 'imageData')
  .where(`"id" = :id`, {id: req.params.id})
  .getRawOne();

  // let projectImage = await getConnection()
  // .getRepository(SurveyPlan)
  // .createQueryBuilder("survey_plan")
  // .select(`ST_AsPNG(ST_AsRaster(ST_Buffer(ST_Boundary("survey_plan"."areaOfInterest"), 0.02,\'join=round\'),${nrq},ARRAY[\'8BUI\', \'8BUI\', \'8BUI\'], ARRAY[118,154,118], ARRAY[255,255,255]))`, 'imageData')
  // .where(`"survey_plan"."id" = :id`, {id: req.params.id})
  // .getRawOne();


  // let projectExtent = await getConnection()
  // .getRepository(SurveyPlan)
  // .createQueryBuilder("survey_plan")
  // .select('ST_Extent("survey_plan"."areaOfInterest")', 'extent')
  // .where(`"survey_plan"."id" = :id`, {id: req.params.id})
  // .getRawOne();
  // console.log(projectExtent)


  // let projectImage = await getConnection()
  // .getRepository(SurveyPlan)
  // .createQueryBuilder("survey_plan")
  // .select('ST_AsPNG(ST_AsRaster(ST_Buffer(ST_Boundary("survey_plan"."areaOfInterest"), 0.02,\'join=round\'),400,400,ARRAY[\'8BUI\', \'8BUI\', \'8BUI\'], ARRAY[118,154,118], ARRAY[255,255,255]))', 'imageData')
  // .where(`"survey_plan"."id" = :id`, {id: req.params.id})
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
      overrideFlag:'public',
      entityType:SurveyPlan,
      custodianAttributes: ['custodians'],
      allowedPermissionAll: 'canEditAllSurveyPlans',
      allowedPermissionCustodian: 'canEditCustodianSurveyPlans',
      allowedPermissionNoEntityId: 'canAddSurveyPlan',
    })
  ],
  asyncMiddleware(async function (req, res) {

  const plan = await getConnection()
  .createQueryBuilder()
  .select(
    [
      `jsonb_build_object(
        'type', 'Feature',
        'id', id,
        'geometry', ST_AsGeoJSON(area_of_interest)::jsonb,
        'properties', jsonb_build_object('id', id, 'surveyName', "surveyName")
      ) as geojson`,
      `"surveyName" as surveyName`,
      `deleted as deleted`
    ]
  )
  .from(SurveyPlan)
  .where(`"id" = :id`, { id: req.params.id })
  .getRawOne();

  if (!plan || plan.deleted) {
    let err = Boom.notFound(
      `Plan ${req.params.id} does not exist`);
    throw err;
  }

  const collection = featureCollection([
    plan.geojson,
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
      overrideFlag:'public',
      entityType:SurveyPlan,
      custodianAttributes: ['custodians'],
      allowedPermissionAll: 'canViewAllSurveyPlans',
      allowedPermissionCustodian: 'canViewCustodianSurveyPlans'})
  ],
  asyncMiddleware(async function (req, res) {
  let project = await getConnection()
  .getRepository(SurveyPlan)
  .findOne(
    req.params.id,
    {
      relations: [
        "custodians",
        "organisations",
        "instrumentTypes",
        "dataCaptureTypes",
        "surveyApplication",
      ]
    }
  );

  if (!project || project.deleted) {
    let err = Boom.notFound(
      `SurveyPlan ${req.params.id} does not exist`);
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
      entityType:SurveyPlan,
      custodianAttributes: ['custodians'],
      allowedPermissionAll: 'canEditAllSurveyPlans',
      allowedPermissionCustodian: 'canEditCustodianSurveyPlans',
      allowedPermissionNoEntityId: 'canAddSurveyPlan',
    })
  ],
  asyncMiddleware(async function (req, res) {

  var project = new SurveyPlan()
  if (req.body.id) {
    project.id = req.body.id;
  }
  project.surveyName = req.body.surveyName
  project.contactPerson = req.body.contactPerson;
  project.email = req.body.email;
  project.custodians = req.body.custodians;
  project.organisations = req.body.organisations;
  project.otherOrganisations = req.body.otherOrganisations;
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
      let err = Boom.badRequest(`Bad status "${status}", must be one of\
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

  if (!_.isNil(req.body.areaOfInterest)) {
    let geojson = geojsonToMultiPolygon(req.body.areaOfInterest);
    project.areaOfInterest = geojson;
  }

  project.public = req.body.public;

  // don't let the post request mark a project as deleted
  project.deleted = false;

  project = await getConnection()
  .getRepository(SurveyPlan)
  .save(project)

  return res.json(project)
}));


router.delete(
  '/:id',
  [
    isAuthenticated,
    permitCustodianBasedPermission({
      entityType:SurveyPlan,
      custodianAttributes: ['custodians'],
      allowedPermissionAll: 'canEditAllSurveyPlans',
      allowedPermissionCustodian: 'canEditCustodianSurveyPlans',
    })
  ],
  asyncMiddleware(async function (req, res) {

  const projMetaRepo = getConnection().getRepository(SurveyPlan);
  const techSpecRepo = getConnection().getRepository(TechSpec);

  let project = await projMetaRepo.findOne(req.params.id);

  if (!project) {
    let err = Boom.notFound(
      `SurveyPlan ${req.params.id} does not exist, cannot delete`);
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
