import * as actions from './survey-application-actions'
import * as getters from './survey-application-getters'
import * as mutations from './survey-application-mutations'

function initialState() {
  return {
    surveyApplications:[],
    surveyApplicationGroups:[],
    selectedSurveyApplication: null,
    selectedSurveyApplicationGroup: null,
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
