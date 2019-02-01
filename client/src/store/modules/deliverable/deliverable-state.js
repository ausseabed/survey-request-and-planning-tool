import * as actions from './deliverable-actions'
import * as getters from './deliverable-getters'
import mutations from './deliverable-mutations'
import * as types from './deliverable-mutation-types'

import { RequestStatus } from '../request-status'

function initialState() {
  return {
    definitionList: [],
    deliverableList: [],
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
