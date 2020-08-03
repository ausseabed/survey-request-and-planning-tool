import * as actions from './survey-request-actions'
import * as getters from './survey-request-getters'
import mutations from './survey-request-mutations'
import * as types from './survey-request-mutation-types'

import { RequestStatus } from '../request-status'

function initialState() {
  return {
    surveyRequest: {},
    restoreSurveyRequest: {},
    surveyRequests:[],  // list of hipp requests, minimal detail
    requestStatus: RequestStatus.NOT_REQUESTED,
    requestError: undefined,
    dirty: false,

    surveyStandards: [],
    overallRisks: [],
    preferredTimeframes: [],
    geojsonAttributeMap: [],
    dataTypes: [],
  }
}

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations: {
    [types.RESET](state) {
      const s = initialState()
      Object.keys(s).forEach(key => {
        state[key] = s[key]
      })
    },
    [types.RESET_HIPP_REQUEST](state) {
      state.surveyRequest = initialState().surveyRequest;
    },
    ...mutations.mutations
  }
}
