import Vue from 'vue'
import Vuex from 'vuex'

import projectMetadata
  from './modules/project-metadata/project-metadata-state'
import dataCaptureType from './modules/data-capture-type/data-capture-type-state'
import instrumentType from './modules/instrument-type/instrument-type-state'
import organisation from './modules/organisation/organisation-state'
import surveyApplication
  from './modules/survey-application/survey-application-state'
import techSpec from './modules/tech-spec/tech-spec-state'
import surveyFile from './modules/survey-file/survey-file-state'
import deliverable from './modules/deliverable/deliverable-state'
import hippRequest from './modules/hipp-request/hipp-request-state'


Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    projectMetadata,
    dataCaptureType,
    instrumentType,
    organisation,
    surveyApplication,
    techSpec,
    surveyFile,
    deliverable,
    hippRequest,
  },
  strict: debug
})
