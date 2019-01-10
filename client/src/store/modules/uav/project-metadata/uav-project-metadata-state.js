// import * as actions from './uav-project-metadata-actions'
import * as actions from './uav-project-metadata-actions'
import * as getters from './uav-project-metadata-getters'
import * as mutations from './uav-project-metadata-mutations'

function initialState() {
  return {
    id: "",
    surveyName: null,
    organisations: [],
    contactPerson: null,
    email: null,
    areaOfInterest: null,
    startDate: Date.now(), // should always be in UTC milliseconds
    purposeSector: null,
    purposeApplicationArea: null,
    description: null,
    vessel: null,
    instrumentTypes: [],
    dataCaptureTypes: [],
    status: 'planning',
    comment: null,
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
