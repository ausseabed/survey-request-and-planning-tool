import * as actions from './tech-spec-actions'
import * as getters from './tech-spec-getters'
import mutations from './tech-spec-mutations'
import * as types from './tech-spec-mutation-types'

import { RequestStatus } from '../request-status'

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
      groundTruthingMethodOther: null,
      groundTruthingRequirements: null,
      mappingCoverageRequirements: null,
      surveyLines: null,
      environmentalConditions: null,
      positioningRequirement: [],
      positioningRequirementOther: null,

      overlap: null,
      gridSize: null,
      swathWidth: null,
      lineSpacing: null,
      maxSurveySpeed: null,
      soundingDensity: null,
      resolution: null,
      horizontalAccuracy: null,
      verticalAccuracy: null,
      horizontalReferenceSystem: null,
      verticalReferenceSystem: null,
      soundingDatum: null,
      spheroid: null,


      deliveryMethods: [],
      deliveryRequirements: null,

      progressReportRequirements: null,

      tidalGauges: false,
      tidalGaugeLocations: null,
      tidalInfrastructureRequirements: null,
      approvalPermitRequirements: null,
      objectDetectionRequirements: null,
      positioningRequirements: null,
      dataGapRequirements: null,
      existingRisks: null,
      additionalRequirements: null,
    },
    requestStatus: RequestStatus.NOT_REQUESTED,
    requestError: undefined,
    validSurveyTypes: [],
    validSurveyClassifications: [],
    validGroundTruthingMethods: [],
    validPositioningRequirements: [],
    validDeliveryMethods: [],

    horizontalReferenceSystems: [],
    verticalReferenceSystems: [],
    soundingDatums: [],
    spheroids: [],
    dirty: false,
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
    [types.RESET_TECH_SPEC](state) {
      state.techSpec = initialState().techSpec;
    },
    ...mutations.mutations
  }
}
