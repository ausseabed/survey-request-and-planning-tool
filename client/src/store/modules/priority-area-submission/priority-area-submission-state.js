import * as actions from './priority-area-submission-actions';
import * as getters from './priority-area-submission-getters';
import * as types from './priority-area-submission-mutation-types';
import mutations from './priority-area-submission-mutations';

import { RequestStatus } from '../request-status';

function initialState() {
  return {
    activePriorityAreaSubmission:{},
    restorePriorityAreaSubmission:{},
    dirty: false,
    priorityAreaSubmissions:[],
    // total number of orgs irrespective of pagination, don't request more than
    // this
    count: undefined,
    pageSize: 50,
    // filter string used for search
    filter: undefined,
    requestStatus: RequestStatus.NOT_REQUESTED,
    requestError: undefined,

    preferredTimeframeOptions: [],
    riskRatingOptions: [],
    requiredDataQualityOptions: [],
    priorityOptions: [],
  }
};

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations: {
    [types.RESET](state) {
      const s = initialState()
      Object.keys(s).forEach(key => {
        state[key] = s[key];
      })
    },
    ...mutations.mutations
  }
};
