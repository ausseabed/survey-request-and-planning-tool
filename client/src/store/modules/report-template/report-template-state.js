import * as actions from './report-template-actions'
import * as getters from './report-template-getters'
import mutations from './report-template-mutations'
import * as types from './report-template-mutation-types'

import { RequestStatus } from '../request-status'

function initialState() {
  return {
    reportTemplates: [],
    reportTemplateTypes: [],

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
