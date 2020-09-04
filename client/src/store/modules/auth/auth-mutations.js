import Vue from 'vue';

import * as types from './auth-mutation-types'

const mutations = {

  [types.SET_AUTHENTICATED] (state, authenticated) {
    state.isAuthenticated = authenticated;
  },

}

export default {
  mutations
}
