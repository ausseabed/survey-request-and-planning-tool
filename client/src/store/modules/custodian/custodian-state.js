import * as actions from './custodian-actions'
import * as getters from './custodian-getters'
import * as types from './custodian-mutation-types'
import mutations from './custodian-mutations'

import { RequestStatus } from '../request-status'

function initialState() {
  return {
    activeCustodian:undefined,
    dirty: false,
    custodians:[],
    requestStatus: RequestStatus.NOT_REQUESTED,
    requestError: undefined,
    deletedCustodians: null, // should deleted custodians be requested
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
