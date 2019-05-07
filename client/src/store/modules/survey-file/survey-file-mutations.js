import * as types from './survey-file-mutation-types';

const mutations = {
  [types.UPDATE] (state, { path, value }) {
    _.set(state, path, _.cloneDeep(value))
  },

  [types.SET_REQUEST_STATUS] (state, status) {
    state.requestStatus = status;
  },

  [types.SET_REQUEST_ERROR] (state, error) {
    state.requestError = error;
  },

  [types.REMOVE_FILE] (state, fileId) {
    state.files = state.files.filter((f) => {
      return f.id != fileId;
    });
  },

  [types.SET_FILE_PROGRESS] (state, {fileId, progress}) {
    const afile = state.files.find((f) => {
      return f.id == fileId;
    });
    afile.progress = progress;
  },

  [types.SET_FILE_DOWNLOADING] (state, {fileId, downloading}) {
    const afile = state.files.find((f) => {
      return f.id == fileId;
    });
    afile.downloading = downloading;
  },

  [types.SET_ATTACHES_TO] (state, attachesTo) {
    state.attachesTo = attachesTo;
  },

  [types.SET_ATTACHES_TO_ID] (state, attachesToId) {
    state.attachesToId = attachesToId;
  },
}

export default {
  mutations
}
