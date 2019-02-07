var express = require('express');
var _ = require('lodash');
const boom = require('boom');

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated }
  from '../utils';

import { DeliverableDefinition } from '../../lib/entity/deliverable-definition';
import { SurveyDeliverable } from '../../lib/entity/survey-deliverable';

var router = express.Router();

// Gets a list of all deliverables that are available within the application
router.get('/definition-list', asyncMiddleware(async function (req, res) {

  let orgs = await getConnection()
  .getRepository(DeliverableDefinition)
  .find({
    relations: [
      "fields",
    ]
  });

  return res.json(orgs);

}));

// Gets a  list of all deliverables assigned to this survey
router.get('/:id/list', asyncMiddleware(async function (req, res) {
  const id = req.params.id;

  let surveyDeliverables = await getConnection()
  .getRepository(SurveyDeliverable)
  .createQueryBuilder("survey_deliverable")
  .where(
    `"projectMetadataId" = :id`,
    {id: id}
  )
  .getMany();

  return res.json(surveyDeliverables);

}));

router.post(
  '/:id/list', isAuthenticated, asyncMiddleware(async function (req, res) {

  const deliverables = req.body;
  let deliverableEntities = deliverables.map((d) => {
    const surveyDeliverable = new SurveyDeliverable();
    _.merge(surveyDeliverable, d);
    return surveyDeliverable;
  });

  deliverableEntities = await getConnection()
  .getRepository(SurveyDeliverable)
  .save(deliverableEntities);

  res.json(deliverableEntities);
}));

router.delete(
  '/:id/', isAuthenticated, asyncMiddleware(async function (req, res) {
  const id = req.params.id;

  await getConnection()
  .createQueryBuilder()
  .delete()
  .from(SurveyDeliverable)
  .where("id = :id", { id: id })
  .execute();

  res.end();
}));

module.exports = router;
