import Vue from 'vue';

import * as types from './organisation-mutation-types';

const mutations = {
  [types.ADD_ORGANISATION] (state, organisation) {
    const existingIndex = state.organisations.findIndex(existingOrganisation => {
      return existingOrganisation.id == organisation.id;
    });
    if (existingIndex == -1) {
      state.organisations.push(organisation);
    } else {
      Vue.set(state.organisations, existingIndex, organisation);
    }

    // update the active organisation too is this is the organisation we are adding
    if (!_.isNil(state.activeOrganisation) &&
      organisation.id == state.activeOrganisation.id)
    {
      state.activeOrganisation = organisation;
    }
  },

  [types.REMOVE_ORGANISATION] (state, id) {
    const oldLength = state.organisations.length
    state.organisations = state.organisations.filter(org => {
      return org.id != id
    })
    // need to recalculate the length
    const newLength = state.organisations.length
    const deltaLength = oldLength - newLength
    //state.count = state.count - deltaLength
  },

  [types.CLEAR_ORGANISATION_LIST] (state, organisations) {
    state.count = undefined;
    state.organisations.splice(0, state.organisations.length);
  },

  [types.SET_ACTIVE_ORGANISATION] (state, organisation) {
    state.activeOrganisation = _.cloneDeep(organisation);
    state.dirty = false;
  },

  [types.SET_DIRTY] (state, dirty) {
    state.dirty = dirty;
  },

  [types.SET_ORGANISATIONS] (state, organisations) {
    state.organisations = organisations;
  },

  [types.SET_FILTER] (state, filter) {
    state.filter = filter;
    state.organisations.splice(0, state.organisations.length);
    state.count = undefined;
  },

  [types.SET_PAGE_DATA] (state, orgPageData) {
    // the org page data contains a count of the total number of orgs, and
    // the list of the orgs returned for this page
    state.count = orgPageData.count
    state.organisations.push(...orgPageData.data)
  },

  [types.SET_REQUEST_ERROR] (state, error) {
    state.requestError = error;
  },

  [types.SET_REQUEST_STATUS] (state, status) {
    state.requestStatus = status;
  },

  [types.UPDATE_ACTIVE_ORGANISATION_VALUE] (state, { path, value }) {
    state.dirty = true;
    Vue.set(state.activeOrganisation, path, _.cloneDeep(value))
  },

}

export default {
  mutations
}
