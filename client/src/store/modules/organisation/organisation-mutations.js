import Vue from 'vue';

import * as types from './organisation-mutation-types';

const mutations = {
  [types.ADD_ORGANISATION] (state, organisation) {
    const existingIndex = state.organisations.findIndex(existingOrg => {
      return existingOrg.id == organisation.id;
    });
    if (existingIndex == -1) {
      state.organisations.push(organisation);
    } else {
      Vue.set(state.organisations, existingIndex, organisation);
    }

    // update the active org too is this is the org we are adding
    if (!_.isNil(state.activeOrganisation) &&
      organisation.id == state.activeOrganisation.id)
    {
      state.activeOrganisation = organisation;
    }
  },

  [types.CLEAR_ORGANISATION_LIST] (state, organisations) {
    state.organisations.splice(0, state.organisations.length);
  },

  [types.SET_ACTIVE_ORGANISATION] (state, organisation) {
    state.activeOrganisation = _.cloneDeep(organisation);
    state.dirty = false;
  },

  [types.SET_DELETED_ORGANISATIONS] (state, deletedOrganisations) {
    state.deletedOrganisations = deletedOrganisations;
  },

  [types.SET_DIRTY] (state, dirty) {
    state.dirty = dirty;
  },

  [types.SET_ORGANISATIONS] (state, organisations) {
    state.organisations = organisations;
  },

  [types.SET_REQUEST_ERROR] (state, error) {
    state.requestError = error;
  },

  [types.SET_REQUEST_STATUS] (state, status) {
    state.requestStatus = status;
  },

  [types.UPDATE_ACTIVE_ORGANISATION_VALUE] (state, { path, value }) {
    state.dirty = true;
    _.set(state.activeOrganisation, path, _.cloneDeep(value))
  },

  [types.SET_USER_ORGANISATION] (state, org) {
    state.userOrganisation = org;
  },
}

export default {
  mutations
}
