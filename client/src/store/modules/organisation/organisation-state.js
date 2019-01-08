// import * as actions from './uav-project-metadata-actions'
import * as actions from './organisation-actions'
import * as getters from './organisation-getters'
import * as mutations from './organisation-mutations'

function initialState() {
  return {
    organisations:[]
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
