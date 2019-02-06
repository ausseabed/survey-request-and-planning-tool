var express = require('express');
var _ = require('lodash');
const boom = require('boom');

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated } from '../utils';
import { SurveyApplication } from '../../lib/entity/survey-application';


var router = express.Router();

router.get('/group-names', async function (req, res) {
  // get a list of the unique group names for survey applications. This supports
  // the two stage selection process of survey applications
  let grps = await getConnection()
  .getRepository(SurveyApplication)
  .createQueryBuilder("survey_application")
  .select(
    'DISTINCT ON (survey_application.group) survey_application.group as group')
  .orderBy("survey_application.group", "ASC").getRawMany();

  let grpNames = grps.map(grp => {
    return grp.group;
  })

  return res.json(grpNames);
});

router.get('/:id', asyncMiddleware(async function (req, res) {
  let sa = await getConnection()
  .getRepository(SurveyApplication)
  .findOne(req.params.id);

  if (!sa || sa.deleted) {
    let err = boom.notFound(
      `SurveyApplication ${req.params.id} does not exist`);
    throw err;
  }

  // don't return the deleted flag
  delete sa.deleted;

  return res.json(sa);
}));

// Gets a list of survey applications
router.get('/', asyncMiddleware(async function (req, res) {
  const whereOpts = _.isNil(req.query['group']) ?
    {deleted: false} :
    {
      group: req.query['group'],
      deleted: false
    }

  const selectOpts = ["id", "name", "group"];

  let surveyApps = await getConnection().getRepository(SurveyApplication)
  .find({
    select:selectOpts,
    where:whereOpts
  });

  return res.json(surveyApps);
}));


module.exports = router;
