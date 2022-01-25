var express = require('express');
var _ = require('lodash');
import * as Boom from '@hapi/boom';

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
        select: ['id', 'name', 'email', 'created', 'lastSeen', 'department', 'requestedCustodian'],
        relations: ['role', 'custodian'],
        order: { name: 'ASC' }
      });
    return res.json(users);
  }));


// gets details of the currently logged in user
router.get(
  '/current',
  isAuthenticated,
  asyncMiddleware(async function (req, res) {

    let user = req.user

    if (!user) {
      let err = Boom.notFound(`No current user`);
      throw err;
    }

    const userDetails = {
      id: user.id,
      name: user.name,
      email: user.email,
      requestedCustodian: user.requestedCustodian,
      role: user.role,
      custodian: user.custodian
    }

    // don't return the deleted flag
    if (userDetails.role) {
      userDetails.role.deleted = undefined;
    }
    if (userDetails.custodian) {
      userDetails.custodian.deleted = undefined;
    }

    return res.json(userDetails);
  }));


// updates details of currently logged in user
// only the logged in user can access this
router.post(
  '/current',
  [isAuthenticated],
  asyncMiddleware(async function (req, res) {

    // new users are never created here, they get made on first authentication
    // as they need a valida OAuth based set of credentials
    if (_.isNil(req.body.id)) {
      let err = Boom.badRequest(`request body does not include 'id' for user`)
      throw err
    }

    if (req.user.id !== req.body.id) {
      let err = Boom.badRequest(`Submitted user id does not match logged in user`)
      throw err
    }

    let user = await getConnection()
      .getRepository(User)
      .findOne(req.user.id)

    if (_.isNil(user)) {
      let err = Boom.notFound(
        `User '${req.body.id}' does not exist, cannot update`);
      throw err;
    }

    // for now users can only change their requested custodian
    user.requestedCustodian = req.body.requestedCustodian;

    user = await getConnection()
      .getRepository(User)
      .save(user)

    // be selective in what gets returned, auth tokens aren't needed here
    user = await getConnection()
      .getRepository(User)
      .findOne(user.id, {
        select: ['id', 'name', 'email', 'department', 'requestedCustodian'],
        relations: ['role', 'custodian'],
      })

    return res.json(user)
  }));


// updates a user
router.post(
  '/',
  [isAuthenticated, permitPermission('canEditUser')],
  asyncMiddleware(async function (req, res) {

    // new users are never created here, they get made on first authentication
    // as they need a valida OAuth based set of credentials
    if (_.isNil(req.body.id)) {
      let err = Boom.badRequest(`request body does not include 'id' for user`)
      throw err
    }

    let user = await getConnection()
      .getRepository(User)
      .findOne(req.body.id)

    if (_.isNil(user)) {
      let err = Boom.notFound(
        `User '${req.body.id}' does not exist, cannot update`);
      throw err;
    }

    // only update role and name.
    // We can't let this update the auth tokens, and email needs to match in
    // CRCSI accounts so don't modify it either
    user.role = req.body.role;
    user.custodian = req.body.custodian;
    user.name = req.body.name;
    user.department = req.body.department;
    user.requestedCustodian = req.body.requestedCustodian;

    user = await getConnection()
      .getRepository(User)
      .save(user)

    // be selective in what gets returned, auth tokens aren't needed here
    user = await getConnection()
      .getRepository(User)
      .findOne(user.id, {
        select: ['id', 'name', 'email', 'department', 'requestedCustodian'],
        relations: ['role', 'custodian'],
      })

    return res.json(user)
  }));


module.exports = router;
