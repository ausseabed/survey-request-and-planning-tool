import Vue from 'vue'
import Vuex from 'vuex'

import uav_tender from './modules/uav/tender/uav_tender_state'
import uav_common from './modules/uav/common/uav_common_state'
import uav_session from './modules/uav/session/uav_session_state'
import uav_project from './modules/uav/project/uav_project_state'
import uav_projectmetadata
  from './modules/uav/project-metadata/uav-project-metadata-state'
import common from './modules/common/common_state'
import socket from './modules/socket/socket_state'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    uav_tender,
    uav_common,
    uav_session,
    uav_project,
    uav_projectmetadata,
    common,
    socket
  },
  strict: debug
})
