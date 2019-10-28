import * as types from './document-mutation-types';

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

  [types.REMOVE_DOCUMENT] (state, fileId) {
    state.documents = state.documents.filter((f) => {
      return f.id != fileId;
    });
  },

  [types.SET_DOCUMENT_PROGRESS] (state, progress) {
    state.documentProgress = progress;
  },

  [types.SET_DOCUMENT_DOWNLOADING] (state, downloading) {
    state.documentDownloading = downloading;
  },
}

export default {
  mutations
}
