var express = require('express');
var _ = require('lodash');
const boom = require('boom');

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated } from '../utils';
import { Role } from '../../lib/entity/role';


var router = express.Router();

// Gets a list of roles
router.get('/', asyncMiddleware(async function (req, res) {
  const whereOpts = {};
  if (!_.isNil(req.query['deleted'])) {
    whereOpts.deleted = req.query['deleted'];
  }

  let roles = await getConnection()
  .getRepository(Role)
  .find({
    where:whereOpts,
    order: {name: 'ASC'}
  });
  return res.json(roles);
}));

// creates/saves a new role
router.post('/', isAuthenticated, asyncMiddleware(async function (req, res) {

  var role = new Role()
  _.merge(role, req.body);

  role = await getConnection()
  .getRepository(Role)
  .save(role)

  role = await getConnection()
  .getRepository(Role)
  .findOne(role.id)
  return res.json(role)
}));

router.delete(
  '/:id', isAuthenticated, asyncMiddleware(async function (req, res) {

  const roleRepo = getConnection().getRepository(Role);

  let role = await roleRepo.findOne(req.params.id);

  if (!role) {
    let err = boom.notFound(
      `Role ${req.params.id} does not exist, cannot delete`);
    throw err;
  }

  role.deleted = true;
  role = await roleRepo.save(role);

  role = await getConnection()
  .getRepository(Role)
  .findOne(role.id)
  return res.json(role)
}));

module.exports = router;
