const _ = require('lodash');
const express = require('express');
const boom = require('boom');
import { interpret } from 'xstate';

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated, isUuid, permitOrgBasedPermission }
  from '../utils';

import { buildRecordMachine } from '../state-management';
import { HippRequest } from '../../lib/entity/hipp-request';
import { ProjectMetadata } from '../../lib/entity/project-metadata';
import { RecordState } from '../../lib/entity/record-state';

const router = express.Router();

router.get(
  '/project-metadata/:id',
  [
    isAuthenticated,
    permitOrgBasedPermission({
      entityType:ProjectMetadata,
      organisationAttributes: ['organisations'],
      allowedPermissionAll: 'canViewAllProjects',
      allowedPermissionOrg: 'canViewOrgProjects'})
  ],
  asyncMiddleware(async function(req, res) {

  const entityId = req.params.id;
  const machine = await buildRecordMachine(
    ProjectMetadata, entityId, req.user, 'organisations');

  console.log(machine.state)

  return res.json({pres: true});
}));


router.get(
  '/hipp-request/:id',
  [
    isAuthenticated,
    permitOrgBasedPermission({
      entityType:HippRequest,
      organisationAttributes: ['requestingAgencies'],
      allowedPermissionAll: 'canViewAllHippRequests',
      allowedPermissionOrg: 'canViewOrgHippRequests'}),
  ],
  asyncMiddleware(async function(req, res) {

  const entityId = req.params.id;
  const machine = await buildRecordMachine(
    HippRequest, entityId, req.user, 'requestingAgencies');

  const service = interpret(machine);

  const currentState = service.state;
  // nextEvents gives us the list of all events that are possible from the
  // current state, but we may not be able to transition to these due to guards
  // (guards for authorisation, etc). To determine if sending one of these
  // to the state machine will cause a transition we need to run it through
  // the nextState method; this doesn't change the machine, but does let us
  // know if the event causes a state transition (ie; is able to transition)
  const nextEvents = currentState.nextEvents.filter((evt) => {
    return service.nextState(evt).changed;
  })

  // we've already queried the db in the `buildRecordMachine` call, but do it
  // again here to get some additional metadata about the currentState
  const record = await getConnection()
  .getRepository(HippRequest)
  .findOne(
    entityId,
    {
      select: ['id'],
      relations: ['recordState', 'recordState.user'],
    }
  );
  let result = record.recordState;
  if (_.isNil(result)) {
    result = {
      version: 0,
    }
  }
  _.merge(result, {
    state: currentState.value,
    nextEvents: nextEvents,
  })

  return res.json(result);


}));

// we don't include the `permitOrgBasedPermission` because these checks are
// handled by the guard checks in the state machine.
router.post(
  '/hipp-request/:id',
  [
    isAuthenticated,
  ],
  asyncMiddleware(async function(req, res) {

  const nextEvent = req.body.nextEvent
  if (_.isNil(nextEvent)) {
    let err = boom.badRequest(
      `Request body needs to include 'nextEvent' parameter`);
    throw err;
  }

  const entityId = req.params.id;
  const machine = await buildRecordMachine(
    HippRequest, entityId, req.user, 'requestingAgencies');

  const service = interpret(machine);
  const newState = service.send(nextEvent);

  const currentState = service.state;
  // nextEvents gives us the list of all events that are possible from the
  // current state, but we may not be able to transition to these due to guards
  // (guards for authorisation, etc). To determine if sending one of these
  // to the state machine will cause a transition we need to run it through
  // the nextState method; this doesn't change the machine, but does let us
  // know if the event causes a state transition (ie; is able to transition)
  const nextEvents = currentState.nextEvents.filter((evt) => {
    return service.nextState(evt).changed;
  })

  // we've already queried the db in the `buildRecordMachine` call, but do it
  // again here to get some additional metadata about the currentState
  const record = await getConnection()
  .getRepository(HippRequest)
  .findOne(
    entityId,
    {
      select: ['id'],
      relations: ['recordState', 'recordState.user'],
    }
  );
  let result = record.recordState;
  if (_.isNil(result)) {
    result = {
      version: 0,
    }
  }
  _.merge(result, {
    state: currentState.value,
    nextEvents: nextEvents,
  })

  return res.json(result);


}));



module.exports = router;
