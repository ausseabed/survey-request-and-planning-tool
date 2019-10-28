import * as actions from './document-actions'
import * as getters from './document-getters'
import mutations from './document-mutations'
import * as types from './document-mutation-types'

import { RequestStatus } from '../request-status'

function initialState() {
  return {
    documents: [],
    documentTypes: [],

    requestStatus: RequestStatus.NOT_REQUESTED,
    requestError: undefined,

    documentProgress: undefined,
    documentDownloading: false,
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
