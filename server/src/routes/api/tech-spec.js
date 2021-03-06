var express = require('express');
var _ = require('lodash');
import * as Boom from '@hapi/boom';

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated, geojsonToMultiPolygon,
  geojsonToMultiLineString, geojsonToMultiPoint, permitCustodianBasedPermission }
  from '../utils';
import { SurveyPlan } from '../../lib/entity/survey-plan';
import { TechSpec, SURVEY_TYPES, SURVEY_CLASSIFICATIONS,
  GROUND_TRUTHING_METHODS, POSITIONING_REQUIREMENTS, DELIVERY_METHODS }
  from '../../lib/entity/tech-spec';


var router = express.Router();

// Gets a list of valid survey types
router.get('/valid-types', async function (req, res) {
  return res.json(SURVEY_TYPES);
});

// Gets a list of valid survey classifications
router.get('/valid-classifications', async function (req, res) {
  return res.json(SURVEY_CLASSIFICATIONS);
});

// Gets a list of valid positioning requirements
router.get('/valid-ground-truthing-methods', async function (req, res) {
  return res.json(GROUND_TRUTHING_METHODS);
});

// Gets a list of valid positioning requirements
router.get('/valid-positioning-requirements', async function (req, res) {
  return res.json(POSITIONING_REQUIREMENTS);
});

router.get('/valid-delivery-methods', async function (req, res) {
  return res.json(DELIVERY_METHODS);
});

// Gets a list of tech specs
// Not currently required
router.get('/', async function (req, res) {
  let techSpecs = await getConnection().getRepository(TechSpec).find();
  return res.json(techSpecs);
});



// gets a single survey technical specification
router.get(
  '/:id',
  [
    isAuthenticated,
    permitCustodianBasedPermission({
      overrideFlag:'public',
      entityType:SurveyPlan,
      custodianAttributes: ['custodians'],
      allowedPermissionAll: 'canViewAllSurveyPlans',
      allowedPermissionCustodian: 'canViewCustodianProjects'})
  ],
  asyncMiddleware(async function (req, res) {
  let techSpec = await getConnection()
  .getRepository(TechSpec)
  .findOne(
    req.params.id,
    {
      relations: [
      ]
    }
  );

  if (!techSpec || techSpec.deleted) {
    let err = Boom.notFound(
      `TechSpec ${req.params.id} does not exist`);
    throw err;
  }
  return res.json(techSpec);
}));

// create new survey technical specification
router.post(
  '/',
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
  var techSpec = new TechSpec();

  if (!_.isNil(req.body.surveyType)) {
    const stype = req.body.surveyType
    if (!SURVEY_TYPES.includes(stype)) {
      let err = Boom.badRequest(`Bad surveyType "${stype}", must be one of\
        ${SURVEY_TYPES.join(', ')}`);
      throw err;
    }
  }

  if (!_.isNil(req.body.surveyClassification)) {
    const clas = req.body.surveyClassification
    if (!SURVEY_CLASSIFICATIONS.includes(clas)) {
      let err = Boom.badRequest(`Bad surveyClassification "${clas}", must be` +
      `one of ${SURVEY_CLASSIFICATIONS.join(', ')}`);
      throw err;
    }
  }

  // merge request body attributes into techSpec entity. Attributes
  // "should" match
  _.merge(techSpec, req.body);

  // postgis will only save a multi line string here, and the request may
  // include a FeatureCollection
  if (!_.isNil(techSpec.surveyLines)) {
    techSpec.surveyLines =
      geojsonToMultiLineString(techSpec.surveyLines);
  }
  if (!_.isNil(techSpec.tidalGaugeLocations)) {
    techSpec.tidalGaugeLocations =
      geojsonToMultiPoint(techSpec.tidalGaugeLocations);
  }


  // don't let the post request mark a tech spec as deleted
  delete techSpec.deleted;

  techSpec = await getConnection()
  .getRepository(TechSpec)
  .save(techSpec)

  return res.json(techSpec)
}));

module.exports = router;
