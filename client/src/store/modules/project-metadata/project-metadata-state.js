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
      startDate: undefined, // should always be in UTC milliseconds
      description: null,
      vessel: null,
      instrumentTypes: [],
      dataCaptureTypes: [],
      projectStatus: 'Planning',
      quality: null,
      comment: null,
      surveyApplication: null,
      contractNumber: null,
      surveyId: null,
      tenderer: null,
      surveyors: [],

      hasMoratorium: false,
      moratoriumDate: undefined,
    },
    surveyApplicationGroupNameOther:undefined,
    surveyApplicationNameOther:undefined,
    surveyApplicationIdOther:undefined,
    projectStatuses:[],
    validDataCaptureTypeIds:new Set(),
    dirty:false,
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
    resetProjectMetadata(state) {
      state.projectMetadata = initialState().projectMetadata;
    },
    ...mutations
  }
}
