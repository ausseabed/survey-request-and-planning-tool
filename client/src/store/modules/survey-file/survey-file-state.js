import * as actions from './survey-file-actions'
import * as getters from './survey-file-getters'
import mutations from './survey-file-mutations'
import * as types from './survey-file-mutation-types'

import { RequestStatus } from '../request-status'

function initialState() {
  return {
    attachesToId: undefined,
    attachesTo: undefined,
    files: [],

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
