import * as actions from './uav_session_actions'
import * as getters from './uav_session_getters'
import * as mutations from './uav_session_mutations'

function initialState() {
  return {
    id: null,
    session_id: null,
    tender: null,
    files: null,
    tilelayout: null,
    results: null,
    notes: null,
    created_by: null,
    created: null,
    hash: null
  }
}

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations: {
    reset(state) {
      const s = initialState()
      Object.keys(s).forEach(key => {
        state[key] = s[key]
      })
    },
    ...mutations
  }
}
