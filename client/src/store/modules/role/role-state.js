import * as actions from './role-actions'
import * as getters from './role-getters'
import * as types from './role-mutation-types'
import mutations from './role-mutations'

import { RequestStatus } from '../request-status'

function initialState() {
  return {
    activeRole:undefined, // role a user has selected in the admin ui
    dirty: false,
    roles:[],
    permissions:[],
    requestStatus: RequestStatus.NOT_REQUESTED,
    requestError: undefined,
  }
}

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations: {
    [types.RESET](state) {
      const s = initialState()
      Object.keys(s).forEach(key => {
        state[key] = s[key]
      })
    },
    ...mutations.mutations
  }
}
