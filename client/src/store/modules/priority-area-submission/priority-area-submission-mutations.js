import _ from 'lodash';
import Vue from 'vue';

import * as types from './priority-area-submission-mutation-types';

const mutations = {
  [types.ADD_PRIORITY_AREA_SUBMISSION](state, priorityAreaSubmission) {
    const existingIndex = state.priorityAreaSubmissions.findIndex(existingPriorityAreaSubmission => {
      return existingPriorityAreaSubmission.id == priorityAreaSubmission.id;
    });
    if (existingIndex == -1) {
      state.priorityAreaSubmissions.push(priorityAreaSubmission);
    } else {
      Vue.set(state.priorityAreaSubmissions, existingIndex, priorityAreaSubmission);
    }

    // update the active priorityAreaSubmission too is this is the priorityAreaSubmission we are adding
    if (!_.isNil(state.activePriorityAreaSubmission) &&
      priorityAreaSubmission.id == state.activePriorityAreaSubmission.id) {
      state.activePriorityAreaSubmission = priorityAreaSubmission;
    }
  },

  [types.REMOVE_PRIORITY_AREA_SUBMISSION](state, id) {
    const oldLength = state.priorityAreaSubmissions.length
    state.priorityAreaSubmissions = state.priorityAreaSubmissions.filter(pas => {
      return pas.id != id
    })
    // need to recalculate the length
    const newLength = state.priorityAreaSubmissions.length
    const deltaLength = oldLength - newLength
    //state.count = state.count - deltaLength
  },

  [types.CLEAR_PRIORITY_AREA_SUBMISSION_LIST](state, priorityAreaSubmissions) {
    state.count = undefined;
    state.priorityAreaSubmissions.splice(0, state.priorityAreaSubmissions.length);
  },

  [types.SET_ACTIVE_PRIORITY_AREA_SUBMISSION](state, priorityAreaSubmission) {
    state.activePriorityAreaSubmission = _.cloneDeep(priorityAreaSubmission);
    state.dirty = false;
  },

  [types.SET_RESTORE_PRIORITY_AREA_SUBMISSION](state, priorityAreaSubmission) {
    state.restorePriorityAreaSubmission = _.cloneDeep(priorityAreaSubmission);
  },

  [types.SET_DIRTY](state, dirty) {
    state.dirty = dirty;
  },

  [types.RESTORE](state) {
    state.activePriorityAreaSubmission = _.cloneDeep(state.restorePriorityAreaSubmission);
    state.dirty = false;
  },

  [types.SET_PRIORITY_AREA_SUBMISSIONS](state, priorityAreaSubmissions) {
    state.priorityAreaSubmissions = priorityAreaSubmissions;
  },

  [types.SET_FILTER](state, filter) {
    state.filter = filter;
    state.priorityAreaSubmissions.splice(0, state.priorityAreaSubmissions.length);
    state.count = undefined;
  },

  [types.SET_PAGE_DATA](state, pasPageData) {
    // the pas page data contains a count of the total number of pas, and
    // the list of the pass returned for this page
    state.count = pasPageData.count
    state.priorityAreaSubmissions.push(...pasPageData.data)
  },

  [types.SET_REQUEST_ERROR](state, error) {
    state.requestError = error;
  },

  [types.SET_REQUEST_STATUS](state, status) {
    state.requestStatus = status;
  },

  [types.UPDATE_ACTIVE_PRIORITY_AREA_SUBMISSION_VALUE](state, { path, value }) {
    state.dirty = true;
    _.set(state.activePriorityAreaSubmission, path, value)
  },

  [types.ADD_PRIORITY_AREAS](state, priorityAreas) {
    const pas = state.activePriorityAreaSubmission.priorityAreas;
    // filter the given list of priority area so that no duplicates are
    // added (based on id)
    const filteredPas = priorityAreas.filter((pa) => {
      var index = pas.findIndex(paInner => paInner.id == pa.id);
      return index == -1;
    });
    if (filteredPas.length == 0) {
      return;
    }
    state.dirty = true;
    // use unshift, new PAs go at start of list
    state.activePriorityAreaSubmission.priorityAreas.unshift(...filteredPas);
  },

  [types.REMOVE_PRIORITY_AREA](state, priorityAreaId) {
    const pas = state.activePriorityAreaSubmission.priorityAreas;
    var index = pas.findIndex(pa => pa.id == priorityAreaId);
    if (index == -1) {
      return;
    }
    state.dirty = true;
    // use unshift, new PAs go at start of list
    state.activePriorityAreaSubmission.priorityAreas.splice(index, 1);
  },

  [types.SET_PREFERRED_TIMEFRAME_OPTIONS](state, options) {
    state.preferredTimeframeOptions = options;
  },

  [types.SET_PRIORITY_OPTIONS](state, options) {
    state.priorityOptions = options;
  },

  [types.SET_REQUIRED_DATA_QUALITY_OPTIONS](state, options) {
    state.requiredDataQualityOptions = options;
  },

  [types.SET_RISK_RATING_OPTIONS](state, options) {
    state.riskRatingOptions = options;
  },

  [types.SET_IDENTIFIED_AREA_OPTIONS](state, options) {
    state.identifiedAreaOptions = options;
  },

}

export default {
  mutations
}
