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
      id: null,
      surveyType: null,
      surveyFrequency: null,
      requirements: null,
      surveyClassification: null,

      featuresOfInterest: null,
      vesselType: null,
      depthRange: null,
      frequencyRange: null,
      timeSensitive: false,
      timeSensitiveRequirements: null,
      groundTruthing: false,
      groundTruthingMethod: null,
      groundTruthingRequirements: null,
      mappingCoverageRequirements: null,
      surveyLines: null,
      environmentalConditions: null,
      positioningRequirement: null,
      positioningRequirementOther: null,
    },
    requestStatus: RequestStatus.NOT_REQUESTED,
    requestError: undefined,
    validSurveyTypes: [],
    validSurveyClassifications: [],
    validGroundTruthingMethods: [],
    validPositioningRequirements: [],
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
