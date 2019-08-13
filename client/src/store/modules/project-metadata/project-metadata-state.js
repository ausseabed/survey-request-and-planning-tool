// import * as actions from './uav-project-metadata-actions'
import * as actions from './project-metadata-actions'
import * as getters from './project-metadata-getters'
import mutations from './project-metadata-mutations'
import * as types from './project-metadata-mutation-types'

import { RequestStatus } from '../request-status'

function initialState() {
  return {
    projectMetadata: {
      id: undefined,
      surveyName: null,
      custodians: [],
      organisations: [],
      contactPerson: null,
      email: null,
      areaOfInterest: null,
      startDate: undefined, // should always be in UTC milliseconds
      endDate: undefined,
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
      tenderer: undefined,
      surveyors: undefined,

      hasMoratorium: false,
      moratoriumDate: undefined,
      hippRequest: undefined,
    },
    surveyApplicationGroupNameOther:undefined,
    surveyApplicationNameOther:undefined,
    surveyApplicationIdOther:undefined,
    projectMetadataListFilter:{},
    projectMetadataList:[],
    projectStatuses:[],
    dirty:false,

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
    [types.RESET] (state) {
      const s = initialState()
      Object.keys(s).forEach(key => {
        state[key] = s[key]
      })
    },
    [types.RESET_PROJECT_METADATA] (state) {
      state.projectMetadata = initialState().projectMetadata;
    },
    ...mutations.mutations
  }
}
