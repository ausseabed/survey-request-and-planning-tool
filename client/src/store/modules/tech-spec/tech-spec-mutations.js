import { UPDATE, SET_REQUEST_STATUS, SET_REQUEST_ERROR, SET_VALID_SURVEY_TYPES,
  SET_VALID_SURVEY_CLASSIFICATIONS, SET_VALID_POSITIONING_REQUIREMENTS,
  SET_VALID_GROUND_TRUTHING_METHODS, SET_SURVEY_LINES }
  from './tech-spec-mutation-types';

const mutations = {
  [UPDATE] (state, { path, value }) {
    _.set(state, path, _.cloneDeep(value))
  },

  [SET_REQUEST_STATUS] (state, status) {
    state.requestStatus = status;
  },

  [SET_REQUEST_ERROR] (state, error) {
    state.requestError = error;
  },

  [SET_VALID_SURVEY_TYPES] (state, validSurveyTypes) {
    state.validSurveyTypes = validSurveyTypes;
  },

  [SET_VALID_SURVEY_CLASSIFICATIONS] (state, validSurveyClassifications) {
    state.validSurveyClassifications = validSurveyClassifications;
  },

  [SET_VALID_GROUND_TRUTHING_METHODS] (state, validGroundTruthingMethods) {
    state.validGroundTruthingMethods = validGroundTruthingMethods;
  },

  [SET_VALID_POSITIONING_REQUIREMENTS] (state, validPositioningRequirements) {
    state.validPositioningRequirements = validPositioningRequirements;
  },

  [SET_SURVEY_LINES] (state, surveyLines) {
    state.techSpec.surveyLines = surveyLines;
  },
}

export default {
  mutations
}
