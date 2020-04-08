const _ = require('lodash');
import { getConnection } from 'typeorm';
import { Machine } from 'xstate';

import { SurveyRequest } from '../lib/entity/survey-request';
import { SurveyPlan } from '../lib/entity/survey-plan';
import { RecordState } from '../lib/entity/record-state';
import { PriorityAreaSubmission } from '../lib/entity/priority-area-submission';


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
          custodianPermission: 'canFinaliseCustodianRecordState',
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
          custodianPermission: 'canReviseCustodianRecordState',
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
          custodianPermission: 'canFinaliseCustodianRecordState',
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
          custodianPermission: 'canFinaliseCustodianRecordState',
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
          custodianPermission: 'canReviseCustodianRecordState',
        },
      },
      ACCEPT: {
        target:'accepted',
        cond: {
          type: 'userPermissionGuard',
          allPermission: 'canAcceptAllRecordState',
          custodianPermission: 'canAcceptCustodianRecordState',
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
          custodianPermission: 'canFinaliseCustodianRecordState',
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
          custodianPermission: 'canRemoveCustodianRecordState',
        },
      }
    },
    entry: ['makeReadonly'],
    exit: ['logAction'],
  },
}


// state machine definition for the HIPP Request
const pasStates = {
  drafted: {
    on: {
      SAVE: {target: 'drafted'},
      SUBMIT: {
        target: 'submitted',
        actions: ['incrementVersion'],
        cond: {
          type: 'userPermissionGuard',
          allPermission: 'canSubmitAllPriorityAreaSubmission',
          custodianPermission: 'canSubmitCustodianPriorityAreaSubmission',
        },
      },
      ARCHIVE: {
        target: 'archived',
        cond: {
          type: 'userPermissionGuard',
          allPermission: 'canPublishAllPriorityAreaSubmission',
          custodianPermission: 'canPublishCustodianPriorityAreaSubmission',
        },
      },
    },
    entry: ['makeWriteable'],
    exit: ['logAction'],
  },
  submitted: {
    on: {
      REVISE: {
        target: 'drafted',
        cond: {
          type: 'userPermissionGuard',
          allPermission: 'canSubmitAllPriorityAreaSubmission',
          custodianPermission: 'canSubmitCustodianPriorityAreaSubmission',
        },
      },
      PUBLISH: {
        target:'published',
        cond: {
          type: 'userPermissionGuard',
          allPermission: 'canPublishAllPriorityAreaSubmission',
          custodianPermission: 'canPublishCustodianPriorityAreaSubmission',
        },
      }
    },
    entry: ['makeReadonly'],
    exit: ['logAction'],
  },
  published: {
    on: {
      ARCHIVE: {
        target: 'archived',
        cond: {
          type: 'userPermissionGuard',
          allPermission: 'canPublishAllPriorityAreaSubmission',
          custodianPermission: 'canPublishCustodianPriorityAreaSubmission',
        },
      },
      REVISE: {
        target:'submitted',
        cond: {
          type: 'userPermissionGuard',
          allPermission: 'canPublishAllPriorityAreaSubmission',
          custodianPermission: 'canPublishCustodianPriorityAreaSubmission',
        },
        actions: ['incrementVersion'],
      }
    },
    entry: ['makeReadonly'],
    exit: ['logAction'],
  },
  archived: {
    on: {
      EDIT: {
        target: 'drafted',
        cond: {
          type: 'userPermissionGuard',
          allPermission: 'canPublishAllPriorityAreaSubmission',
          custodianPermission: 'canPublishCustodianPriorityAreaSubmission',
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
  async (entityType, entityId, user, entityCustodianListAttribute, recordType) => {

  // the states, and migrations between them differ based on entity
  // so get the right states for the given entity type
  let states = undefined
  let defaultStateName = undefined
  if (entityType == SurveyRequest) {
    states = requestStates
    defaultStateName = 'draft'
  } else if (entityType == SurveyPlan) {
    states = planStates
    defaultStateName = 'draft'
  } else if (entityType == PriorityAreaSubmission) {
    states = pasStates
    defaultStateName = 'drafted'
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
        entityCustodianListAttribute
      ],
    }
  );
  if (_.isNil(record)) {
    throw new Error(`Missing record ${entityType.name} ${entityId}`);
  }

  let recordState = undefined;
  if (_.isNil(record.recordState)) {
    recordState = new RecordState();
    recordState.state = defaultStateName;
    recordState.version = 0;
  } else {
    recordState = record.recordState;
  }

  // some entities may define just a single custodian and not a list
  // so convert single objects to an array (containing the one object)
  let entityCustodians = record[entityCustodianListAttribute];
  if (!Array.isArray(entityCustodians)) {
    entityCustodians = [entityCustodians];
  }

  const id = entityType.name + 'Record'
  const machine = Machine({
    id: id,
    context: {
      user: user, // current user, used to log changes
      entityType: entityType,
      entityId: entityId,
      entityCustodians: entityCustodians,
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
        if (
          context.user.role[cond.custodianPermission] &&
          !_.isNil(context.user.custodian)
          )
        {
          // then user has the custodian based permission to pass this guard, but we
          // need to check their custodian matches the custodians linked to the entity
          const custodians = context.entityCustodians;
          const matchingCustodian = custodians.find((custodian) => {
            return custodian.id === context.user.custodian.id;
          })
          if (!_.isNil(matchingCustodian)) {
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
