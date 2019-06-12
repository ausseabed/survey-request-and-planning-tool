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

  [types.ADD_ORGANISATION] (state, organisation) {
    state.projectMetadata.organisations.push(organisation);
    state.dirty = true;
  },

  [types.SET_ORGANISATIONS] (state, organisations) {
    state.projectMetadata.organisations = organisations;
    state.dirty = true;
  },

  [types.REMOVE_ORGANISATION] (state, organisations) {
    state.projectMetadata.organisations = organisations;
    state.dirty = true;
  },

  [types.REMOVE_ORGANISATION] (state, organisation) {
    let index = state.projectMetadata.organisations.findIndex(function (o) {
      return o.id == organisation.id;
    });
    state.projectMetadata.organisations.splice(index, 1);
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

  [types.SET_SURVEYORS] (state, organisations) {
    state.projectMetadata.surveyors = organisations;
    state.dirty = true;
  },

  [types.SET_TENDERER] (state, organisation) {
    state.projectMetadata.tenderer = organisation;
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

}

export default {
  mutations
}
