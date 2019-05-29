var express = require('express');
var _ = require('lodash');
const boom = require('boom');

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated, permitPermission } from '../utils';
import { Role } from '../../lib/entity/role';


var router = express.Router();


// gets a single role for the current logged in user
router.get(
  '/user-role',
  isAuthenticated,
  asyncMiddleware(async function (req, res) {

  let role = req.user.role

  if (!role || role.deleted) {
    let err = boom.notFound(
      `Currently logged in user has no role`);
    throw err;
  }

  // don't return the deleted flag
  delete role.deleted;

  return res.json(role);
}));


// Gets a list of roles
router.get(
  '/',
  [isAuthenticated, permitPermission('isAdmin')],
  asyncMiddleware(async function (req, res) {

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
router.post(
  '/',
  [isAuthenticated, permitPermission('canEditRole')],
  asyncMiddleware(async function (req, res) {

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
  '/:id',
  [isAuthenticated, permitPermission('canEditRole')],
  asyncMiddleware(async function (req, res) {

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
