import Vue from 'vue';

import * as types from './user-mutation-types'

const mutations = {

  [types.UPDATE_USER] (state, user) {
    const existingIndex = state.users.findIndex(existingUser => {
      return existingUser.id == user.id;
    });
    if (existingIndex == -1) {
      // but should never happen (users are only created on first auth)
      state.users.push(user);
    } else {
      Vue.set(state.users, existingIndex, user);
    }

    // update the active user
    if (!_.isNil(state.activeUser) && user.id == state.activeUser.id)
    {
      state.activeUser = user;
    }
  },

  [types.CLEAR_USER_LIST] (state, users) {
    state.users.splice(0, state.users.length);
  },

  [types.SET_ACTIVE_USER] (state, user) {
    state.activeUser = _.cloneDeep(user);
    state.dirty = false;
  },

  [types.SET_DIRTY] (state, dirty) {
    state.dirty = dirty;
  },

  [types.SET_USERS] (state, users) {
    state.users = users;
  },

  [types.SET_REQUEST_ERROR] (state, error) {
    state.requestError = error;
  },

  [types.SET_REQUEST_STATUS] (state, status) {
    state.requestStatus = status;
  },

  [types.UPDATE_ACTIVE_USER_VALUE] (state, { path, value }) {
    state.dirty = true;
    _.set(state.activeUser, path, _.cloneDeep(value))
  },
}

export default {
  mutations
}
