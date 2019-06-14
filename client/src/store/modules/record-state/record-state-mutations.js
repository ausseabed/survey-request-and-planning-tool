import * as types from './record-state-mutation-types';

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

}

export default {
  mutations
}
