import { UPDATE, SET_REQUEST_STATUS, SET_REQUEST_ERROR, REMOVE_FILE }
  from './survey-file-mutation-types';

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

  [REMOVE_FILE] (state, fileId) {
    state.files = state.files.filter((f) => {
      return f.id != fileId;
    });
  },
}

export default {
  mutations
}
