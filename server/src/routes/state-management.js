const _ = require('lodash');
import { getConnection } from 'typeorm';
import { Machine } from 'xstate';

import { HippRequest } from '../lib/entity/hipp-request';
import { ProjectMetadata } from '../lib/entity/project-metadata';
import { RecordState } from '../lib/entity/record-state';


// state machine definition for the survey plan
// this state machine differs to the request state machine as it does not
// include the accepted state
const planStates = {
  draft: {
    on: {
      SAVE: {target: 'draft'},
      FINALISE: {
        target: 'finalised',
        actions: ['incrementVersion'],
        cond: {
          type: 'userPermissionGuard',
          allPermission: 'canFinaliseAllRecordState',
          orgPermission: 'canFinaliseOrgRecordState',
        },
      },
    },
    entry: ['makeWriteable'],
    exit: ['logAction'],
  },
  finalised: {
    on: {
      REVISE: {
        target: 'underReview',
        cond: {
          type: 'userPermissionGuard',
          allPermission: 'canReviseAllRecordState',
          orgPermission: 'canReviseOrgRecordState',
        },
      },
    },
    entry: ['makeReadonly'],
    exit: ['logAction'],
  },
  underReview: {
    on: {
      SAVE: 'underReview',
      FINALISE: {
        target:'finalised',
        cond: {
          type: 'userPermissionGuard',
          allPermission: 'canFinaliseAllRecordState',
          orgPermission: 'canFinaliseOrgRecordState',
        },
        actions: ['incrementVersion'],
      }
    },
    entry: ['makeWriteable'],
    exit: ['logAction'],
  },
}


// state machine definition for the HIPP Request
const requestStates = {
  draft: {
    on: {
      SAVE: {target: 'draft'},
      FINALISE: {
        target: 'finalised',
        actions: ['incrementVersion'],
        cond: {
          type: 'userPermissionGuard',
          allPermission: 'canFinaliseAllRecordState',
          orgPermission: 'canFinaliseOrgRecordState',
        },
      },
    },
    entry: ['makeWriteable'],
    exit: ['logAction'],
  },
  finalised: {
    on: {
      REVISE: {
        target: 'underReview',
        cond: {
          type: 'userPermissionGuard',
          allPermission: 'canReviseAllRecordState',
          orgPermission: 'canReviseOrgRecordState',
        },
      },
      ACCEPT: {
        target:'accepted',
        cond: {
          type: 'userPermissionGuard',
          allPermission: 'canAcceptAllRecordState',
          orgPermission: 'canAcceptOrgRecordState',
        },
      }
    },
    entry: ['makeReadonly'],
    exit: ['logAction'],
  },
  underReview: {
    on: {
      SAVE: 'underReview',
      FINALISE: {
        target:'finalised',
        cond: {
          type: 'userPermissionGuard',
          allPermission: 'canFinaliseAllRecordState',
          orgPermission: 'canFinaliseOrgRecordState',
        },
        actions: ['incrementVersion'],
      }
    },
    entry: ['makeWriteable'],
    exit: ['logAction'],
  },
  accepted: {
    on: {
      REMOVE: {
        target: 'finalised',
        cond: {
          type: 'userPermissionGuard',
          allPermission: 'canRemoveAllRecordState',
          orgPermission: 'canRemoveOrgRecordState',
        },
      }
    },
    entry: ['makeReadonly'],
    exit: ['logAction'],
  },
}


// creates a state machine for the given record type and entity id
// user is required to support permission based guards in the state machine.
export const buildRecordMachine =
  async (entityType, entityId, user, entityOrgListAttribute, recordType) => {

  // the states, and migrations between them differ based on entity
  // so get the right states for the given entity type
  let states = undefined
  if (entityType == HippRequest) {
    states = requestStates
  } else if (entityType == ProjectMetadata) {
    states = planStates
  } else {
    throw new Error(`Unknown entityType ${entityType.name}`);
  }

  // get the initial state of the record from the database
  const record = await getConnection()
  .getRepository(entityType)
  .findOne(
    entityId,
    {
      select: ['id'],
      relations: [
        'recordState',
        entityOrgListAttribute
      ],
    }
  );
  if (_.isNil(record)) {
    throw new Error(`Missing record ${entityType.name} ${entityId}`);
  }

  let recordState = undefined;
  if (_.isNil(record.recordState)) {
    recordState = new RecordState();
    recordState.state = 'draft';
    recordState.version = 0;
  } else {
    recordState = record.recordState;
  }

  const entityOrgs = record[entityOrgListAttribute];

  const id = entityType.name + 'Record'
  const machine = Machine({
    id: id,
    context: {
      user: user, // current user, used to log changes
      entityType: entityType,
      entityId: entityId,
      entityOrgs: entityOrgs,
      recordType: recordType,
      recordStateVersion: recordState.version,
      // can the record be modified. Allows state machine to determine if the
      // record can be modified.
      readonly: true,
    },
    initial: recordState.state,
    strict: true,
    states: states
  },{
    actions: {
      incrementVersion: (context, event) => {
        if (_.isNil(context.recordStateVersion)) {
          context.recordStateVersion = 0
        }
        context.recordStateVersion += 1;
      },
      makeReadonly: (context, event) => {
        context.readonly = true;
      },
      makeWriteable: (context, event) => {
        context.readonly = false;
      },
      logAction: (context, event) => {
        //console.log('----------');
        //console.log(context);
        //console.log(event);
      },
    },
    guards: {
      alwaysFalse: (context, event) => {
        console.log("guard called")
        return false;
      },
      userPermissionGuard: (context, event, {cond}) => {
        // guard checks if the current user has the necessary permission to
        // transition state.
        if (context.user.role[cond.allPermission]) {
          // the user has a role with the all permission to satisfy this guard
          // eg; "canAcceptAllRecordState" because they can mark all projects
          // and requests as accepted.
          return true;
        }
        if (context.user.role[cond.orgPermission]) {
          // then user has the org based permission to pass this guard, but we
          // need to check their org matches the orgs linked to the entity
          const orgs = context.entityOrgs;
          const matchingOrg = orgs.find((org) => {
            return org.id === context.user.organisation.id;
          })
          if (!_.isNil(matchingOrg)) {
            return true;
          }
        }
        return false
      },
    }
  })
  return machine
}

export const updateRecordState =
  async (entityType, entityId, user, recordType) => {

  let oldRecordState = undefined
  if (!_.isNil(entityId)) {
    const record = await getConnection()
    .getRepository(entityType)
    .findOne(
      entityId,
      {
        select: ['id'],
        relations: ['recordState'],
      }
    );
    if (_.isNil(record)) {
      throw new Error(`Missing record ${entityType.name} ${entityId}`);
    }
    oldRecordState = record.recordState;
  }

  let newRecordState = new RecordState();
  newRecordState.created = Date.now();
  newRecordState.user = user;
  newRecordState.recordType = recordType;
  newRecordState.recordId = entityId;

  if (_.isNil(oldRecordState)) {
    // no previous record state, so just make a new one
    newRecordState.state = 'draft';
  } else {
    newRecordState.previous = oldRecordState;
    newRecordState.state = oldRecordState.state;
    // by default version number is not updated, that is reserved for special
    // actions
    newRecordState.version = oldRecordState.version;
  }

  return newRecordState
}
