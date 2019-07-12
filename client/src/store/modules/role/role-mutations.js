import Vue from 'vue';

import * as types from './role-mutation-types'

const mutations = {

  [types.ADD_ROLE] (state, role) {
    const existingIndex = state.roles.findIndex(existingRole => {
      return existingRole.id == role.id;
    });
    if (existingIndex == -1) {
      state.roles.push(role);
    } else {
      Vue.set(state.roles, existingIndex, role);
    }

    // update the active user
    if (!_.isNil(state.activeRole) && role.id == state.activeRole.id)
    {
      state.activeRole = role;
    }
  },

  [types.CLEAR_ROLE_LIST] (state, roles) {
    state.roles.splice(0, state.roles.length);
  },

  [types.SET_ACTIVE_ROLE] (state, role) {
    state.activeRole = _.cloneDeep(role);
    state.dirty = false;
  },

  [types.SET_DIRTY] (state, dirty) {
    state.dirty = dirty;
  },

  [types.SET_ROLES] (state, roles) {
    state.roles = roles;
  },

  [types.SET_REQUEST_ERROR] (state, error) {
    state.requestError = error;
  },

  [types.SET_REQUEST_STATUS] (state, status) {
    state.requestStatus = status;
  },

  [types.UPDATE_ACTIVE_ROLE_VALUE] (state, { path, value }) {
    state.dirty = true;
    _.set(state.activeRole, path, _.cloneDeep(value))
  },

  [types.SET_USER_ROLE] (state, role) {
    state.userRole = role;
  },

  [types.SET_PERMISSIONS] (state, permissions) {
    state.permissions = permissions;
  },
}

export default {
  mutations
}
