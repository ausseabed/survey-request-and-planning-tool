var express = require('express');
var _ = require('lodash');
const boom = require('boom');

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated }
  from '../utils';

import { DeliverableDefinition } from '../../lib/entity/deliverable-definition';


const deliverableList = [
  {
    id:'1',
    definitionId:'00203202-99ed-46cc-bb3a-464258356485',
    data: {},
  },
  {
    id:'2',
    definitionId:'3a9a83ab-761f-4e11-8f6a-6eb722c3f459',
    data: {format:"xml"},
  },
  {
    id:'3',
    definitionId:'cef07095-1755-42de-83cf-3a94094812fd',
    data: {},
  },
  {
    id:'4',
    definitionId:'5909f1db-d889-43dd-95e0-2ac17e0242d7',
    data: {},
  },
  {
    id:'5',
    definitionId:'577d2242-be18-440a-8246-106b4a74cc0b',
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
  res.json(deliverableList);
}));

router.post(
  '/:id/list', isAuthenticated, asyncMiddleware(async function (req, res) {

  console.log("deliverable list post request");
  console.log(req.body);

  res.end();

}));


module.exports = router;
