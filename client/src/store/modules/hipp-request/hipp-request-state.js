import * as actions from './hipp-request-actions'
import * as getters from './hipp-request-getters'
import mutations from './hipp-request-mutations'
import * as types from './hipp-request-mutation-types'

import { RequestStatus } from '../request-status'

function initialState() {
  return {
    hippRequest: {
      id: undefined,
      name: undefined,
      requestingAgency: undefined,
      requestorName: undefined,
      pointOfContactEmail: undefined,
      pointOfContactPhone: undefined,
      requestDate: undefined,
      areaName: undefined,
      area: undefined,
      businessJustification: undefined,
      costBenefit: undefined,
      areaOfInterest: undefined,
      comments: undefined,
      hasMoratorium: false,
      moratoriumDate: undefined,

      surveyQualityRequirements: undefined,
      surveyQualityRequirementsComments: undefined,
      chartProductQualityImpactRequirements: undefined,
      chartProductQualityImpactRequirementsComments: undefined,

      riskData: {},
      riskIssues: undefined,
    },
    hippRequests:[],  // list of hipp requests, minimal detail
    requestStatus: RequestStatus.NOT_REQUESTED,
    requestError: undefined,
    dirty: false,

    riskMatrix: {},
    chartProductQualityImpactRequirements: [],
    surveyQualityRequirements: [],
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
      state.hippRequest = initialState().hippRequest;
    },
    ...mutations.mutations
  }
}
