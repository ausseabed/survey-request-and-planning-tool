import * as types from './project-metadata-mutation-types'

const mutations = {
  [types.UPDATE] (state, { path, value }) {
    _.set(state, path, _.cloneDeep(value))
    state.dirty = true;
  },

  [types.REPLACE] (state, updated_state) {
    Object.assign(state, updated_state);
    state.dirty = true;
  },

  [types.SET_AOI] (state, geojson) {
    state.projectMetadata.areaOfInterest = geojson;
    state.dirty = true;
  },

  [types.SET_INSTRUMENT_TYPES] (state, instrumentTypes) {
    state.projectMetadata.instrumentTypes = instrumentTypes;
    state.dirty = true;
  },

  [types.SET_DATA_CAPTURE_TYPES] (state, dataCaptureTypes) {
    state.projectMetadata.dataCaptureTypes = dataCaptureTypes;
    state.dirty = true;
  },

  [types.ADD_ORGANISATION] (state, custodian) {
    state.projectMetadata.custodians.push(custodian);
    state.dirty = true;
  },

  [types.SET_ORGANISATIONS] (state, custodians) {
    state.projectMetadata.custodians = custodians;
    state.dirty = true;
  },

  [types.REMOVE_ORGANISATION] (state, custodians) {
    state.projectMetadata.custodians = custodians;
    state.dirty = true;
  },

  [types.REMOVE_ORGANISATION] (state, custodian) {
    let index = state.projectMetadata.custodians.findIndex(function (o) {
      return o.id == custodian.id;
    });
    state.projectMetadata.custodians.splice(index, 1);
    state.dirty = true;
  },

  [types.SET_START_DATE] (state, startDate) {
    state.projectMetadata.startDate = startDate;
    state.dirty = true;
  },

  [types.SET_SURVEY_APPLICATION] (state, surveyApplication) {
    state.projectMetadata.surveyApplication = surveyApplication;
    state.dirty = true;
  },

  [types.SET_PROJECT_STATUSES] (state, statuses) {
    state.projectStatuses = statuses;
  },

  [types.SET_SURVEYORS] (state, custodians) {
    state.projectMetadata.surveyors = custodians;
    state.dirty = true;
  },

  [types.SET_TENDERER] (state, custodian) {
    state.projectMetadata.tenderer = custodian;
    state.dirty = true;
  },

  [types.SET_SURVEY_APPLICATION_ID_OTHER] (state, surveyApplicationIdOther) {
    return state.surveyApplicationIdOther = surveyApplicationIdOther;
  },

  [types.SET_SURVEY_APPLICATION_NAME_OTHER] (state, surveyApplicationNameOther) {
    return state.surveyApplicationNameOther = surveyApplicationNameOther;
  },

  [types.SET_SURVEY_APPLICATION_GROUP_NAME_OTHER] (state, surveyApplicationGroupNameOther) {
    return state.surveyApplicationGroupNameOther = surveyApplicationGroupNameOther;
  },

  [types.SET_DIRTY] (state, dirty) {
    return state.dirty = dirty;
  },

  [types.SET_PROJECT_METADATA_LIST_FILTER] (state, listfilterparams) {
    return state.projectMetadataListFilter = listfilterparams;
  },

  [types.UPDATE_PROJECT_METADATA_LIST_FILTER] (state, { path, value }) {
    _.set(state.projectMetadataListFilter, path, _.cloneDeep(value))
  },

  [types.SET_PROJECT_METADATA_LIST] (state, pmlist) {
    return state.projectMetadataList = pmlist;
  },

  [types.SET_REQUEST_ERROR] (state, error) {
    state.requestError = error;
  },

  [types.SET_REQUEST_STATUS] (state, status) {
    state.requestStatus = status;
  },
}

export default {
  mutations
}
