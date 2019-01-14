var express = require('express');
var _ = require('lodash');
const boom = require('boom');

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated } from '../utils';
import { SurveyApplication } from '../../lib/entity/survey-application';


var router = express.Router();

router.get('/group-names', async function (req, res) {
  let grpNames = await getConnection()
  .getRepository(SurveyApplication)
  .createQueryBuilder("survey_application")
  .select('DISTINCT ON (survey_application.group) survey_application.group as group').orderBy("survey_application.group", "ASC").getRawMany();

  return res.json(grpNames);
});

// Gets a list of survey applications
router.get('/', async function (req, res) {
  let surveyApps = await getConnection().getRepository(SurveyApplication)
  .find();

  return res.json(surveyApps);
});


module.exports = router;
