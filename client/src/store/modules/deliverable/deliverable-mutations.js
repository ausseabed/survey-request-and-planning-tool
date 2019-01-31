import { UPDATE, SET_DEFINITION_LIST, SET_REQUEST_STATUS, SET_REQUEST_ERROR}
  from './deliverable-mutation-types';

const mutations = {
  [UPDATE] (state, { path, value }) {
    _.set(state, path, _.cloneDeep(value))
  },

  [SET_DEFINITION_LIST] (state, list) {
    state.definitionList = list;
  },

  [SET_REQUEST_STATUS] (state, status) {
    state.requestStatus = status;
  },

  [SET_REQUEST_ERROR] (state, error) {
    state.requestError = error;
  },

}

export default {
  mutations
}
