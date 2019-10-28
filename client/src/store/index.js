import Vue from 'vue'
import Vuex from 'vuex'

import surveyPlan from './modules/survey-plan/survey-plan-state'
import dataCaptureType from './modules/data-capture-type/data-capture-type-state'
import instrumentType from './modules/instrument-type/instrument-type-state'
import custodian from './modules/custodian/custodian-state'
import surveyApplication
  from './modules/survey-application/survey-application-state'
import techSpec from './modules/tech-spec/tech-spec-state'
import surveyFile from './modules/survey-file/survey-file-state'
import deliverable from './modules/deliverable/deliverable-state'
import surveyRequest from './modules/survey-request/survey-request-state'
import organisation from './modules/organisation/organisation-state'
import reportTemplate from './modules/report-template/report-template-state'
import user from './modules/user/user-state'
import role from './modules/role/role-state'
import recordState from './modules/record-state/record-state-state'
import requestPurpose from './modules/request-purpose/request-purpose-state'
import document from './modules/document/document-state'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    surveyPlan,
    dataCaptureType,
    instrumentType,
    custodian,
    surveyApplication,
    techSpec,
    surveyFile,
    deliverable,
    surveyRequest,
    reportTemplate,
    user,
    role,
    recordState,
    requestPurpose,
    organisation,
    document,
  },
  strict: debug
})
