import * as actions from './organisation-actions'
import * as getters from './organisation-getters'
import * as types from './organisation-mutation-types'
import mutations from './organisation-mutations'

import { RequestStatus } from '../request-status'

function initialState() {
  return {
    activeOrganisation:undefined,
    dirty: false,
    organisations:[],
    // total number of orgs irrespective of pagination, don't request more than
    // this
    count: undefined,
    pageSize: 20,
    // filter string used for search
    filter: undefined,
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
