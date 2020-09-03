import * as actions from './auth-actions'
import * as getters from './auth-getters'
import * as types from './auth-mutation-types'
import mutations from './auth-mutations'

function initialState() {
  return {
    isAuthenticated: false
  }
}

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations: {
    ...mutations.mutations
  }
}
