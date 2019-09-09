import * as actions from './survey-request-actions'
import * as getters from './survey-request-getters'
import mutations from './survey-request-mutations'
import * as types from './survey-request-mutation-types'

import { RequestStatus } from '../request-status'

function initialState() {
  return {
    surveyRequest: {
      id: undefined,
      name: undefined,
      public: false,
      custodians: [],
      organisations: [],
      requestorName: undefined,
      requestorPosition: undefined,
      pointOfContactEmail: undefined,
      pointOfContactPhone: undefined,
      requestDateStart: undefined,
      requestDateEnd: undefined,
      area: undefined,
      businessJustification: undefined,
      areaOfInterest: undefined,
      comments: undefined,
      hasMoratorium: false,
      moratoriumDate: undefined,
      moratoriumComment: undefined,
      purposes: undefined,
      dataCaptureTypes: [],

      surveyQualityRequirements: undefined,
      surveyQualityRequirementsComments: undefined,
      chartProductQualityImpactRequirements: undefined,
      chartProductQualityImpactRequirementsComments: undefined,

      riskData: {},
      riskIssues: undefined,
    },
    surveyRequests:[],  // list of hipp requests, minimal detail
    requestStatus: RequestStatus.NOT_REQUESTED,
    requestError: undefined,
    dirty: false,

    riskMatrix: {},
    chartProductQualityImpactRequirements: [],
    surveyQualityRequirements: [],
    geojsonAttributeMap: [],
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
