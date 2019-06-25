const _ = require('lodash');
const express = require('express');
const boom = require('boom');
import { interpret } from 'xstate';

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated, isUuid, permitOrgBasedPermission }
  from '../utils';

import { buildRecordMachine, updateRecordState } from '../state-management';
import { HippRequest } from '../../lib/entity/hipp-request';
import { ProjectMetadata } from '../../lib/entity/project-metadata';
import { RecordState } from '../../lib/entity/record-state';

const router = express.Router();

// the 'permitOrgBasedPermission' middleware checks only work if a request
// is targetting a hipp request OR project. hence we separate out the response
// logic into this function so the handlers (below) can include the parameters
// specific to a hipp request (eg) in the handler definition.
async function handleGetRequest(
  req, res, entityType, orgAttribute, recordType) {

  const entityId = req.params.id;

  const machine = await buildRecordMachine(
    entityType, entityId, req.user, orgAttribute, recordType);

  const service = interpret(machine);
  service.start();

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
  .getRepository(entityType)
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
    readonly: currentState.context.readonly,
  })

  return res.json(result);

}


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

  await handleGetRequest(req, res, HippRequest, 'requestingAgencies', 'request')
}));


router.get(
  '/project-metadata/:id',
  [
    isAuthenticated,
    permitOrgBasedPermission({
      entityType:ProjectMetadata,
      organisationAttributes: ['organisations'],
      allowedPermissionAll: 'canViewAllProjects',
      allowedPermissionOrg: 'canViewOrgProjects'}),
  ],
  asyncMiddleware(async function(req, res) {

  await handleGetRequest(req, res, ProjectMetadata, 'organisations', 'plan')
}));


// we don't include the `permitOrgBasedPermission` because these checks are
// handled by the guard checks in the state machine.
router.post(
  '/:entityTypeStr/:id',
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

  const entityTypeStr = req.params.entityTypeStr;
  const entityId = req.params.id;
  let machine = undefined;
  let recordType = undefined;
  let entityType = undefined;

  if (entityTypeStr == 'hipp-request') {
    entityType = HippRequest;
    recordType = 'request';
    machine = await buildRecordMachine(
      entityType, entityId, req.user, 'requestingAgencies', recordType);
  } else if (entityTypeStr == 'project-metadata') {
    entityType = ProjectMetadata;
    recordType = 'plan';
    machine = await buildRecordMachine(
      entityType, entityId, req.user, 'organisations', recordType);
  } else {
    let err = boom.badRequest(
      `entityTypeStr (/:entityTypeStr/:id) must be 'hipp-request' ` +
      `or 'project-metadata'`);
    throw err;
  }

  let newRecordState = undefined;

  const service = interpret(machine);
  service.onTransition(async (state) => {
    if (!state.changed) {
      return
    }

    const newRecordState = new RecordState();

    const message = `User state change ${state.history.value} to ${state.value}`;
    newRecordState.changeDescription = message;
    newRecordState.state = state.value;
    newRecordState.previous = state.context.recordState;
    newRecordState.user = req.user;
    newRecordState.created = Date.now();
    newRecordState.recordType = recordType;
    newRecordState.version = state.context.recordStateVersion;

    let recordEntity = await getConnection()
    .getRepository(entityType)
    .findOne(
      req.params.id,
      {
        relations: [
          'recordState'
        ]
      },
    );
    newRecordState.previous = recordEntity.recordState;
    recordEntity.recordState = newRecordState;

    recordEntity = await getConnection()
    .getRepository(entityType)
    .save(recordEntity)

    // don't forget to include what the next possible events are, otherwise
    // the UI won't know what to do
    const nextEvents = state.nextEvents.filter((evt) => {
      return service.nextState(evt).changed;
    })
    newRecordState.nextEvents = nextEvents;
    newRecordState.readonly = state.context.readonly;

    return res.json(newRecordState);
  });
  service.start();

  const newState = service.send(nextEvent);

  service.stop();

}));


module.exports = router;
