import { ADD_ORGANISATION, CLEAR_ORGANISATION_LIST, SET_DIRTY,
  SET_ORGANISATIONS, SET_REQUEST_ERROR, SET_REQUEST_STATUS}
  from './organisation-mutation-types';

const mutations = {
  [ADD_ORGANISATION] (state, organisation) {
    state.organisations.push(organisation);
  },

  [CLEAR_ORGANISATION_LIST] (state, organisations) {
    state.organisations.splice(0, state.organisations.length);
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
  }
}

export default {
  mutations
}
