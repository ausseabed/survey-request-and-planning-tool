import Vue from 'vue';

import { ADD_ORGANISATION, CLEAR_ORGANISATION_LIST, SET_DIRTY,
  SET_ORGANISATIONS, SET_REQUEST_ERROR, SET_REQUEST_STATUS,
  SET_ACTIVE_ORGANISATION, UPDATE_ACTIVE_ORGANISATION_VALUE }
  from './organisation-mutation-types';

const mutations = {
  [ADD_ORGANISATION] (state, organisation) {
    const existingIndex = state.organisations.findIndex(existingOrg => {
      return existingOrg.id == organisation.id;
    });
    if (existingIndex == -1) {
      state.organisations.push(organisation);
    } else {
      Vue.set(state.organisations, existingIndex, organisation);
    }

  },

  [CLEAR_ORGANISATION_LIST] (state, organisations) {
    state.organisations.splice(0, state.organisations.length);
  },

  [SET_ACTIVE_ORGANISATION] (state, organisation) {
    state.activeOrganisation = _.cloneDeep(organisation);
    state.dirty = false;
  },

  [SET_DIRTY] (state, dirty) {
    state.dirty = dirty;
  },

  [SET_ORGANISATIONS] (state, organisations) {
    state.organisations = organisations;
  },

  [SET_REQUEST_ERROR] (state, error) {
    state.requestError = error;
  },

  [SET_REQUEST_STATUS] (state, status) {
    state.requestStatus = status;
  },

  [UPDATE_ACTIVE_ORGANISATION_VALUE] (state, { path, value }) {
    state.dirty = true;
    _.set(state.activeOrganisation, path, _.cloneDeep(value))
  },
}

export default {
  mutations
}
