import * as actions from './survey-plan-actions'
import * as getters from './survey-plan-getters'
import mutations from './survey-plan-mutations'
import * as types from './survey-plan-mutation-types'

import { RequestStatus } from '../request-status'

function initialState() {
  return {
    surveyPlan: {
      id: undefined,
      surveyName: null,
      custodians: [],
      organisations: [],
      contactPerson: null,
      email: null,
      areaOfInterest: null,
      startDate: undefined, // should always be in UTC milliseconds
      endDate: undefined,
      description: null,
      vessel: null,
      instrumentTypes: [],
      dataCaptureTypes: [],
      status: 'Planning',
      quality: null,
      comment: null,
      surveyApplication: null,
      contractNumber: null,
      surveyId: null,
      tenderer: undefined,
      surveyors: undefined,

      hasMoratorium: false,
      moratoriumDate: undefined,
      surveyRequest: undefined,
    },
    surveyApplicationGroupNameOther:undefined,
    surveyApplicationNameOther:undefined,
    surveyApplicationIdOther:undefined,
    surveyPlanListFilter:{},
    surveyPlanList:[],
    surveyPlanStatuses:[],
    dirty:false,

    requestStatus: RequestStatus.NOT_REQUESTED,
    requestError: undefined,
  }
}

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations: {
    [types.RESET] (state) {
      const s = initialState()
      Object.keys(s).forEach(key => {
        state[key] = s[key]
      })
    },
    [types.RESET_PROJECT_METADATA] (state) {
      state.surveyPlan = initialState().surveyPlan;
    },
    ...mutations.mutations
  }
}
