const _ = require('lodash');
const express = require('express');
import * as Boom from '@hapi/boom';
import { interpret } from 'xstate';

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated, isUuid, permitCustodianBasedPermission,
  permitPermission }
  from '../utils';

import { buildRecordMachine, updateRecordState } from '../state-management';
import { SurveyRequest } from '../../lib/entity/survey-request';
import { SurveyPlan } from '../../lib/entity/survey-plan';
import { RecordState } from '../../lib/entity/record-state';
import { PriorityAreaSubmission } from '../../lib/entity/priority-area-submission';

const router = express.Router();


router.get(
  '',
  [
    isAuthenticated,
    permitPermission('isAdmin'),
  ],
  asyncMiddleware(async function(req, res) {

  let { start, limit, filter } = req.query;

  start = _.isNil(start) ? 0 : start;
  limit = _.isNil(limit) ? 0 : limit;
  limit = limit > 100 ? 100 : limit;  // don't ever allow more than 100

  let qb = getConnection().getRepository(RecordState)
  .createQueryBuilder("record_state")
  .leftJoinAndSelect("record_state.user", "user")
  .leftJoinAndSelect("survey_request", "survey_request", 'record_state."recordType" = \'request\' AND survey_request.id = record_state."recordId"')
  .leftJoinAndSelect("survey_plan", "survey_plan", 'record_state."recordType" = \'plan\' AND survey_plan.id = record_state."recordId"')
  .select('record_state.id', 'id')
  .addSelect('record_state.state', 'state')
  .addSelect('record_state.created', 'created')
  .addSelect('record_state.version', 'version')
  .addSelect('record_state."recordType"', 'recordType')
  .addSelect('record_state."recordId"', 'recordId')
  .addSelect('record_state."changeDescription"', 'changeDescription')
  .addSelect('record_state."previousId"', 'previousId')
  .addSelect('user.name', 'userName')
  .addSelect('survey_request.name', 'surveyRequestName')
  .addSelect('survey_plan."surveyName"', 'surveyPlanName')
  .orderBy('record_state.created', 'DESC')

  if (!_.isNil(filter)) {
    qb = qb
    .where('survey_request.name ilike :name', {name: '%' + filter + '%' })
    .orWhere('survey_plan."surveyName" ilike :name', {name: '%' + filter + '%' })
    .orWhere('user.name ilike :name', {name: '%' + filter + '%' })
  }

  let count = await qb.getCount();

  qb = qb
  .offset(start)
  .limit(limit);

  const recordStates = await qb.getRawMany();

  // to make things easier on the client we consolidate the record entity name
  // into a consistent attribute `entityName`
  recordStates.forEach(rs => {
    rs.entityName =
      _.isNil(rs.surveyRequestName) ?
        rs.surveyPlanName :
        rs.surveyRequestName
  })

  return res.json({
    count: count,
    data: recordStates
  });
}));


// the 'permitCustodianBasedPermission' middleware checks only work if a request
// is targetting a hipp request OR project. hence we separate out the response
// logic into this function so the handlers (below) can include the parameters
// specific to a hipp request (eg) in the handler definition.
async function handleGetRequest(
  req, res, entityType, custodianAttribute, recordType) {

  const entityId = req.params.id;

  const machine = await buildRecordMachine(
    entityType, entityId, req.user, custodianAttribute, recordType);

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
  '/survey-request/:id',
  [
    isAuthenticated,
    permitCustodianBasedPermission({
      overrideFlag:'public',
      entityType:SurveyRequest,
      custodianAttributes: ['custodians'],
      allowedPermissionAll: 'canViewAllSurveyRequests',
      allowedPermissionCustodian: 'canViewCustodianSurveyRequests'}),
  ],
  asyncMiddleware(async function(req, res) {

  await handleGetRequest(req, res, SurveyRequest, 'custodians', 'request')
}));


router.get(
  '/survey-plan/:id',
  [
    isAuthenticated,
    permitCustodianBasedPermission({
      overrideFlag:'public',
      entityType:SurveyPlan,
      custodianAttributes: ['custodians'],
      allowedPermissionAll: 'canViewAllSurveyPlans',
      allowedPermissionCustodian: 'canViewCustodianSurveyPlans'}),
  ],
  asyncMiddleware(async function(req, res) {

  await handleGetRequest(req, res, SurveyPlan, 'custodians', 'plan')
}));


router.get(
  '/priority-area-submission/:id',
  [
    isAuthenticated,
    permitCustodianBasedPermission({
      entityType:PriorityAreaSubmission,
      custodianAttributes: ['custodian'],
      allowedPermissionAll: 'canViewAllPriorityAreaSubmissions',
      allowedPermissionCustodian: 'canViewCustodianPriorityAreaSubmissions'}),
  ],
  asyncMiddleware(async function(req, res) {

  await handleGetRequest(req, res, PriorityAreaSubmission, 'custodian', 'priority area submission')
}));


// we don't include the `permitCustodianBasedPermission` because these checks are
// handled by the guard checks in the state machine.
router.post(
  '/:entityTypeStr/:id',
  [
    isAuthenticated,
  ],
  asyncMiddleware(async function(req, res) {

  const nextEvent = req.body.nextEvent
  if (_.isNil(nextEvent)) {
    let err = Boom.badRequest(
      `Request body needs to include 'nextEvent' parameter`);
    throw err;
  }

  const entityTypeStr = req.params.entityTypeStr;
  const entityId = req.params.id;
  let machine = undefined;
  let recordType = undefined;
  let entityType = undefined;

  if (entityTypeStr == 'survey-request') {
    entityType = SurveyRequest;
    recordType = 'request';
    machine = await buildRecordMachine(
      entityType, entityId, req.user, 'custodians', recordType);
  } else if (entityTypeStr == 'survey-plan') {
    entityType = SurveyPlan;
    recordType = 'plan';
    machine = await buildRecordMachine(
      entityType, entityId, req.user, 'custodians', recordType);
  } else if (entityTypeStr == 'priority-area-submission') {
    entityType = PriorityAreaSubmission;
    recordType = 'priority area submission';
    machine = await buildRecordMachine(
      entityType, entityId, req.user, 'custodian', recordType);
  } else {
    let err = Boom.badRequest(
      `entityTypeStr (/:entityTypeStr/:id) must be 'survey-request' ` +
      `or 'survey-plan'`);
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
    newRecordState.recordId = req.params.id;

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

    // don't fcustodianet to include what the next possible events are, otherwise
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
