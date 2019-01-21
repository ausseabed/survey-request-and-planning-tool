var express = require('express');
var _ = require('lodash');
const boom = require('boom');

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated, geojsonToMultiPolygon }
  from '../utils';
import { TechSpec, SURVEY_TYPES }
  from '../../lib/entity/tech-spec';


var router = express.Router();

// Gets a list of valid survey types
router.get('/valid-types', async function (req, res) {
  return res.json(SURVEY_TYPES);
});


// Gets a list of tech specs
// Not currently required
router.get('/', async function (req, res) {
  let techSpecs = await getConnection().getRepository(TechSpec).find();
  return res.json(techSpecs);
});



// gets a single survey technical specification
router.get('/:id', asyncMiddleware(async function (req, res) {
  let techSpec = await getConnection()
  .getRepository(TechSpec)
  .findOne(
    req.params.id,
    {
      relations: [
      ]
    }
  );

  if (!techSpec) {
    let err = boom.notFound(
      `TechSpec ${req.params.id} does not exist`);
    throw err;
  }
  return res.json(project);
}));

// create new survey technical specification
router.post('/', isAuthenticated, asyncMiddleware(async function (req, res) {
  return res.json(project);
  var techSpec = new TechSpec();

  if (!_.isNil(req.body.surveyType)) {
    const stype = req.body.surveyType
    if (!SURVEY_TYPES.includes(stype)) {
      let err = boom.badRequest(`Bad surveyType "${stype}", must be one of\
        ${SURVEY_TYPES.join(', ')}`);
      throw err;
    }
  }

  // merge request body attributes into techSpec entity. Attributes
  // "should" match
  _.merge(techSpec, req.body);

  techSpec = await getConnection()
  .getRepository(TechSpec)
  .save(techSpec)

  return res.json(techSpec)
}));

module.exports = router;
