// import * as actions from './uav-project-metadata-actions'
import * as actions from './project-metadata-actions'
import * as getters from './project-metadata-getters'
import * as mutations from './project-metadata-mutations'

function initialState() {
  return {
    projectMetadata: {
      id: "",
      surveyName: null,
      organisations: [],
      contactPerson: null,
      email: null,
      areaOfInterest: null,
      startDate: Date.now(), // should always be in UTC milliseconds
      description: null,
      vessel: null,
      instrumentTypes: [],
      dataCaptureTypes: [],
      projectStatus: 'Planning',
      comment: null,
      surveyApplication: null,
    },
    projectStatuses:[],
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
