import * as types from './report-template-mutation-types';

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

  [types.REMOVE_REPORT_TEMPLATE] (state, fileId) {
    state.reportTemplates = state.reportTemplates.filter((f) => {
      return f.id != fileId;
    });
  },

}

export default {
  mutations
}
