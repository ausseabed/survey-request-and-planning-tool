var express = require('express');
var _ = require('lodash');
import * as Boom from '@hapi/boom';

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated, permitPermission } from '../utils';
import { Role } from '../../lib/entity/role';
import { User } from '../../lib/entity/user';


var router = express.Router();


// gets a single role for the current logged in user
router.get(
  '/user-role',
  isAuthenticated,
  asyncMiddleware(async function (req, res) {

  let role = req.user.role

  if (!role || role.deleted) {
    let err = Boom.notFound(
      `Currently logged in user has no role`);
    throw err;
  }

  // don't return the deleted flag
  delete role.deleted;

  return res.json(role);
}));

// gets a list of permissions that apply to all roles
router.get(
  '/permissions',
  isAuthenticated,
  asyncMiddleware(async function (req, res) {

  const role = new Role();
  const permissionsList = [];

  for (let [key, value] of Object.entries(role)) {
    if (key.startsWith('can') || key.startsWith('is')) {
      permissionsList.push(key);
    }
  }

  return res.json(permissionsList);
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

  if (role.isDefault) {
    await getConnection()
    .createQueryBuilder()
    .update(Role)
    .set({ isDefault: false })
    .execute();
  }

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
    let err = Boom.notFound(
      `Role ${req.params.id} does not exist, cannot delete`);
    throw err;
  }
  if (role.isDefault) {
    let err = Boom.badRequest(
      `Role ${req.params.id} is default, cannot delete`);
    throw err;
  }

  let defaultRole = await roleRepo.findOne({
    where: {
      isDefault: true
    }
  });
  if (!role) {
    let err = Boom.notFound(
      `Default role does not exist, cannot delete`);
    throw err;
  }

  // update all users with the role getting deleted so that they have the
  // default role assigned.
  await getConnection().transaction(async transactionalEntityManager => {
    await getConnection()
    .createQueryBuilder()
    .update(User)
    .set({ role: defaultRole})
    .where(`"roleId" = :rid`, { rid: role.id })
    .execute();

    await roleRepo.delete(req.params.id);
  });

  return res.json(role)
}));

module.exports = router;
