// import * as actions from './uav-project-metadata-actions'
import * as getters from './uav-project-metadata-getters'
import * as mutations from './uav-project-metadata-mutations'

function initialState() {
  return {
    id: "",
    surveyName: null,
    organisaitions: [],
    contactPerson: null,
    email: null,
    areaOfInterest: null,
    startDate: null,
    purposeSector: null,
    purposeApplicationArea: null,
    description: null,
    vessel: null,
    instrumentType: [],
    dataCapture: [],
    status: 'planning',
    comments: null,
  }
}

export default {
  namespaced: true,
  state: initialState,
  getters,
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
