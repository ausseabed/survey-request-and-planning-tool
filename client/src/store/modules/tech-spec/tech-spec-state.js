import * as actions from './tech-spec-actions'
import * as getters from './tech-spec-getters'
import mutations from './tech-spec-mutations'
import * as types from './tech-spec-mutation-types'

export const RequestStatus = Object.freeze({
    NOT_REQUESTED:   Symbol("not requested"),
    REQUESTED:  Symbol("requested"),
    SUCCESS: Symbol("success"),
    ERROR: Symbol("error"),
});

function initialState() {
  return {
    techSpec: {
      projectMetadataId: null,
      contractNumber: null,
      surveyType: null,
      surveyFrequency: null,
      requirements: null,
      tenderer: null,
      surveyors: [],
    },
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
    [types.RESET](state) {
      const s = initialState()
      Object.keys(s).forEach(key => {
        state[key] = s[key]
      })
    },
    ...mutations.mutations
  }
}
