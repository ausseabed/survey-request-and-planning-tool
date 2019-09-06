import Vue from 'vue';

import * as types from './survey-plan-mutation-types'

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
    state.surveyPlan.areaOfInterest = geojson;
    state.dirty = true;
  },

  [types.SET_INSTRUMENT_TYPES] (state, instrumentTypes) {
    state.surveyPlan.instrumentTypes = instrumentTypes;
    state.dirty = true;
  },

  [types.SET_DATA_CAPTURE_TYPES] (state, dataCaptureTypes) {
    state.surveyPlan.dataCaptureTypes = dataCaptureTypes;
    state.dirty = true;
  },

  [types.ADD_CUSTODIAN] (state, custodian) {
    state.surveyPlan.custodians.push(custodian);
    state.dirty = true;
  },

  [types.SET_CUSTODIANS] (state, custodians) {
    state.surveyPlan.custodians = custodians;
    state.dirty = true;
  },

  [types.SET_ORGANISATIONS] (state, organisations) {
    Vue.set(state.surveyPlan, 'organisations', organisations);
    state.dirty = true;
  },

  [types.REMOVE_CUSTODIAN] (state, custodians) {
    state.surveyPlan.custodians = custodians;
    state.dirty = true;
  },

  [types.REMOVE_CUSTODIAN] (state, custodian) {
    let index = state.surveyPlan.custodians.findIndex(function (o) {
      return o.id == custodian.id;
    });
    state.surveyPlan.custodians.splice(index, 1);
    state.dirty = true;
  },

  [types.SET_START_DATE] (state, startDate) {
    state.surveyPlan.startDate = startDate;
    state.dirty = true;
  },

  [types.SET_SURVEY_APPLICATION] (state, surveyApplication) {
    state.surveyPlan.surveyApplication = surveyApplication;
    state.dirty = true;
  },

  [types.SET_PROJECT_STATUSES] (state, statuses) {
    state.surveyPlanStatuses = statuses;
  },

  [types.SET_SURVEYORS] (state, custodians) {
    state.surveyPlan.surveyors = custodians;
    state.dirty = true;
  },

  [types.SET_TENDERER] (state, custodian) {
    state.surveyPlan.tenderer = custodian;
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

  [types.SET_SURVEY_PLAN_LIST_FILTER] (state, listfilterparams) {
    return state.surveyPlanListFilter = listfilterparams;
  },

  [types.UPDATE_SURVEY_PLAN_LIST_FILTER] (state, { path, value }) {
    _.set(state.surveyPlanListFilter, path, _.cloneDeep(value))
  },

  [types.SET_SURVEY_PLAN_LIST] (state, pmlist) {
    return state.surveyPlanList = pmlist;
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
