import * as actions from './data-capture-type-actions'
import * as getters from './data-capture-type-getters'
import * as mutations from './data-capture-type-mutations'

function initialState() {
  return {
    dataCaptureTypes:[]
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
