import Vue from 'vue'
import Vuex from 'vuex'

import uav_tender from './modules/uav/tender/uav_tender_state'
import uav_common from './modules/uav/common/uav_common_state'
import uav_session from './modules/uav/session/uav_session_state'
import uav_project from './modules/uav/project/uav_project_state'
import projectMetadata
  from './modules/project-metadata/project-metadata-state'
import common from './modules/common/common_state'
import socket from './modules/socket/socket_state'
import dataCaptureType from './modules/data-capture-type/data-capture-type-state'
import instrumentType from './modules/instrument-type/instrument-type-state'
import organisation from './modules/organisation/organisation-state'
import surveyApplication
  from './modules/survey-application/survey-application-state'
import techSpec from './modules/tech-spec/tech-spec-state'
import surveyFile from './modules/survey-file/survey-file-state'


Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    projectMetadata,
    socket,
    dataCaptureType,
    instrumentType,
    organisation,
    surveyApplication,
    techSpec,
    surveyFile,
  },
  strict: debug
})
