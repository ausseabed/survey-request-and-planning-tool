// import * as actions from './uav-project-metadata-actions'
import * as actions from './instrument-type-actions'
import * as getters from './instrument-type-getters'
import * as mutations from './instrument-type-mutations'

function initialState() {
  return {
    instrumentTypes:[]
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
