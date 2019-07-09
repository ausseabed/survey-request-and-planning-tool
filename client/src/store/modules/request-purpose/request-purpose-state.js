import * as actions from './request-purpose-actions'
import * as getters from './request-purpose-getters'
import mutations from './request-purpose-mutations'
import * as types from './request-purpose-mutation-types'

import { RequestStatus } from '../request-status'

function initialState() {
  return {
    requestPurposes: [],

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
