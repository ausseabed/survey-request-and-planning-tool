var express = require('express');
var _ = require('lodash');
const boom = require('boom');

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated, geojsonToMultiPolygon }
  from '../utils';
import { ProjectMetadata, PROJECT_STATUSES }
  from '../../lib/entity/project-metadata';
import { SurveyApplication } from '../../lib/entity/survey-application';
import { TechSpec } from '../../lib/entity/tech-spec';


var router = express.Router();

// Gets a list of project metadata
router.get('/valid-statuses', async function (req, res) {
  return res.json(PROJECT_STATUSES);
});

// Gets a list of project metadata
router.get('/', async function (req, res) {

  let projectsQuery = getConnection()
  .getRepository(ProjectMetadata)
  .createQueryBuilder("project_metadata")
  .select(["project_metadata.id", "project_metadata.surveyName",
    "project_metadata.startDate", "project_metadata.projectStatus"])
  .where(
    `project_metadata.deleted = :deleted`,
    {deleted: false}
  )
  if (!_.isNil(req.query['hipp-request'])) {
    projectsQuery = projectsQuery.andWhere(`"project_metadata"."hippRequestId" = :hrid`,
      {hrid: req.query['hipp-request']})
  }
  let projects = await projectsQuery.getMany();

  return res.json(projects);
});

// gets a single project metadata
router.get('/:id', asyncMiddleware(async function (req, res) {
  let project = await getConnection()
  .getRepository(ProjectMetadata)
  .findOne(
    req.params.id,
    {
      relations: [
        "organisations",
        "instrumentTypes",
        "dataCaptureTypes",
        "surveyApplication",
        "tenderer",
        "surveyors",
        "hippRequest",
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
router.post('/', isAuthenticated, asyncMiddleware(async function (req, res) {

  var project = new ProjectMetadata()
  if (req.body.id) {
    project.id = req.body.id;
  }
  project.surveyName = req.body.surveyName
  project.contactPerson = req.body.contactPerson;
  project.email = req.body.email;
  project.organisations = req.body.organisations;
  project.startDate = req.body.startDate;
  project.instrumentTypes = req.body.instrumentTypes;
  project.dataCaptureTypes = req.body.dataCaptureTypes;

  let surveyApp = req.body.surveyApplication;
  if (!_.isNil(surveyApp) && surveyApp.userSubmitted) {
    surveyApp = await getConnection()
    .getRepository(SurveyApplication)
    .save(surveyApp);
  }
  project.surveyApplication = surveyApp;


  if (!_.isNil(req.body.projectStatus)) {
    const status = req.body.projectStatus
    if (!PROJECT_STATUSES.includes(status)) {
      let err = boom.badRequest(`Bad projectStatus "${status}", must be one of\
        ${PROJECT_STATUSES.join(', ')}`);
      throw err;
    }
    project.projectStatus = status;
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

  project.hippRequest = req.body.hippRequest;

  let geojson = geojsonToMultiPolygon(req.body.areaOfInterest);
  project.areaOfInterest = geojson;

  // don't let the post request mark a project as deleted
  delete project.deleted;

  project = await getConnection()
  .getRepository(ProjectMetadata)
  .save(project)

  return res.json(project)
}));

router.delete(
  '/:id', isAuthenticated, asyncMiddleware(async function (req, res) {

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
