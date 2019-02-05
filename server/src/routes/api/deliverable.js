var express = require('express');
var _ = require('lodash');
const boom = require('boom');

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated }
  from '../utils';

import { DeliverableDefinition } from '../../lib/entity/deliverable-definition';
import { SurveyDeliverable } from '../../lib/entity/survey-deliverable';

const deliverableList = [
  {
    id:'1',
    definitionId:'835ae12a-a20e-43e4-8a35-fe5beb088838',
    data: {},
  },
  {
    id:'2',
    definitionId:'ea8f1e48-2d88-41f8-abc8-acca284830c8',
    data: {format:"xml"},
  },
  {
    id:'3',
    definitionId:'65ca2c7d-04a2-4717-8607-8f23dead1d08',
    data: {},
  },
  {
    id:'4',
    definitionId:'e42e0366-97ff-4335-8e5f-5be00020b703',
    data: {},
  },
  {
    id:'5',
    definitionId:'4ad77790-da95-4389-885e-3f2abd15dcfd',
    data: {},
  },
];


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
