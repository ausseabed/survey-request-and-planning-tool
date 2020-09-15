import Vue from 'vue';

import * as types from './custodian-mutation-types';

const mutations = {
  [types.ADD_CUSTODIAN] (state, custodian) {
    const existingIndex = state.custodians.findIndex(existingCustodian => {
      return existingCustodian.id == custodian.id;
    });
    if (existingIndex == -1) {
      state.custodians.push(custodian);
    } else {
      Vue.set(state.custodians, existingIndex, custodian);
    }

    // update the active custodian too is this is the custodian we are adding
    if (!_.isNil(state.activeCustodian) &&
      custodian.id == state.activeCustodian.id)
    {
      state.activeCustodian = custodian;
    }
  },

  [types.CLEAR_CUSTODIAN_LIST] (state, custodians) {
    state.custodians.splice(0, state.custodians.length);
  },

  [types.SET_ACTIVE_CUSTODIAN] (state, custodian) {
    state.activeCustodian = _.cloneDeep(custodian);
    state.dirty = false;
  },

  [types.SET_DELETED_CUSTODIANS] (state, deletedCustodians) {
    state.deletedCustodians = deletedCustodians;
  },

  [types.SET_DIRTY] (state, dirty) {
    state.dirty = dirty;
  },

  [types.SET_CUSTODIANS] (state, custodians) {
    state.custodians = custodians;
  },

  [types.SET_REQUEST_ERROR] (state, error) {
    state.requestError = error;
  },

  [types.SET_REQUEST_STATUS] (state, status) {
    state.requestStatus = status;
  },

  [types.UPDATE_ACTIVE_CUSTODIAN_VALUE] (state, { path, value }) {
    state.dirty = true;
    _.set(state.activeCustodian, path, _.cloneDeep(value))
  },

}

export default {
  mutations
}
