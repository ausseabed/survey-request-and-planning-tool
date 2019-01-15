var express = require('express');
var _ = require('lodash');
const boom = require('boom');

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated, geojsonToMultiPolygon }
  from '../utils';
import { ProjectMetadata, PROJECT_STATUSES }
  from '../../lib/entity/project-metadata';


var router = express.Router();

// Gets a list of project metadata
router.get('/valid-statuses', async function (req, res) {
  return res.json(PROJECT_STATUSES);
});

// Gets a list of project metadata
router.get('/', async function (req, res) {
  let projects = await getConnection().getRepository(ProjectMetadata).find();
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
      ]
    }
  );

  if (!project) {
    let err = boom.notFound(
      `ProjectMetadata ${req.params.id} does not exist`);
    throw err;
  }
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
  project.surveyApplication = req.body.surveyApplication;
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
  project.vessel = req.body.vessel;


  let geojson = geojsonToMultiPolygon(req.body.areaOfInterest);
  project.areaOfInterest = geojson.geometry;

  project = await getConnection()
  .getRepository(ProjectMetadata)
  .save(project)

  return res.json(project)
}));

module.exports = router;
