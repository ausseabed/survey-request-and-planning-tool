import * as actions from './user-actions'
import * as getters from './user-getters'
import * as types from './user-mutation-types'
import mutations from './user-mutations'

import { RequestStatus } from '../request-status'

function initialState() {
  return {
    activeUser:undefined,
    dirty: false,
    users:[],
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
