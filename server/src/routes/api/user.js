var express = require('express');
var _ = require('lodash');
const boom = require('boom');

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated, permitPermission } from '../utils';
import { User } from '../../lib/entity/user';


var router = express.Router();

// Gets a list of users
router.get(
  '/',
  [isAuthenticated, permitPermission('isAdmin')],
  asyncMiddleware(async function (req, res) {

  let users = await getConnection()
  .getRepository(User)
  .find({
    select: ['id', 'name', 'email'],
    relations: ['role', 'organisation'],
    order: {name: 'ASC'}
  });
  return res.json(users);
}));

// updates a user
router.post(
  '/',
  [isAuthenticated, permitPermission('canEditUser')],
  asyncMiddleware(async function (req, res) {

  // new users are never created here, they get made on first authentication
  // as they need a valida OAuth based set of credentials
  if (_.isNil(req.body.id)) {
    let err = boom.badRequest(`request body does not include 'id' for user`)
    throw err
  }

  let user = await getConnection()
  .getRepository(User)
  .findOne(req.body.id)

  if (_.isNil(user)) {
    let err = boom.notFound(
      `User '${req.body.id}' does not exist, cannot update`);
    throw err;
  }

  // only update role and name.
  // We can't let this update the auth tokens, and email needs to match in
  // CRCSI accounts so don't modify it either
  user.role = req.body.role;
  user.organisation = req.body.organisation;
  user.name = req.body.name;

  user = await getConnection()
  .getRepository(User)
  .save(user)

  // be selective in what gets returned, auth tokens aren't needed here
  user = await getConnection()
  .getRepository(User)
  .findOne(user.id, {
    select: ['id', 'name', 'email'],
    relations: ['role', 'organisation'],
  })

  return res.json(user)
}));


module.exports = router;
