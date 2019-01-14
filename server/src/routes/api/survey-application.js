var express = require('express');
var _ = require('lodash');
const boom = require('boom');

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated } from '../utils';
import { SurveyApplication } from '../../lib/entity/survey-application';


var router = express.Router();

// Gets a list of survey applications
router.get('/', async function (req, res) {
  let surveyApps = await getConnection().getRepository(SurveyApplication)
  .find();

  return res.json(surveyApps);
});


module.exports = router;
