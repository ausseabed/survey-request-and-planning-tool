var express = require('express');
var _ = require('lodash');
const boom = require('boom');

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated } from '../utils';
import { ProjectMetadata } from '../../lib/entity/project-metadata';


var router = express.Router();

// Gets a list of project metadata
router.get('/', async function (req, res) {
  let projects = await getConnection().getRepository(ProjectMetadata).find();
  return res.json(projects);
});

// gets a single project metadata
router.get('/:id', asyncMiddleware(async function (req, res) {
  let project = await getConnection()
  .getRepository(ProjectMetadata)
  .findOne(req.params.id, { relations: ["organisations"] });

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
  project.surveyName = req.body.surveyName
  project.contactPerson = req.body.contactPerson;
  project.email = req.body.email;

  project = await getConnection()
  .getRepository(ProjectMetadata)
  .save(project)

  // var pm_id = req.body && req.body.id ? req.body.id : uuid5("project-metadata", uuid4());
  // let pm = {
  //   id: pm_id,
  //   type: req.params.type,
  //   created_by: req.user.id,
  //   created_on: new Date().toISOString(),
  //   updated_on: new Date().toISOString(),
  // }
  // pm = _.merge(pm, _.omit(req.body, ['id', 'type', 'areaOfInterest']))
  // console.log(pm);

  return res.json(project)
}));

module.exports = router;
