import * as actions from './record-state-actions'
import * as getters from './record-state-getters'
import mutations from './record-state-mutations'
import * as types from './record-state-mutation-types'

import { RequestStatus } from '../request-status'

function initialState() {
  return {
    recordState: undefined,

    entityType: undefined,
    entityId: undefined,

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
