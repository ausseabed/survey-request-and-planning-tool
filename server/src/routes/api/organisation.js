var express = require('express');
var _ = require('lodash');
const boom = require('boom');

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated } from '../utils';
import { Organisation } from '../../lib/entity/organisation';


var router = express.Router();

// Gets a list of organisations
router.get('/', async function (req, res) {
  let orgs = await getConnection().getRepository(Organisation).find();
  return res.json(orgs);
});

// creates a new organisation
router.post('/', isAuthenticated, asyncMiddleware(async function (req, res) {

  var org = new Organisation()
  if (!_.isNil(req.body.id)) {
    org.id = req.body.id;
  }
  org.name = req.body.name;

  org = await getConnection()
  .getRepository(Organisation)
  .save(org)

  return res.json(org)
}));

module.exports = router;
