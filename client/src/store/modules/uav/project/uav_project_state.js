import * as actions from './uav_project_actions'
import * as getters from './uav_project_getters'
import * as mutations from './uav_project_mutations'

function initialState() {
  return {
    id: null,
    project_name: null,
    type: null,
    sessions: null,
    tender: null,
    report: null,
    read_users: [],
    write_users: [],
    updated: null,
    updated_by: null,
    created: null,
    created_by: null,
    current_session: null
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
