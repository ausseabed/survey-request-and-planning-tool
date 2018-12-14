import * as actions from './uav_common_actions'
import * as getters from './uav_common_getters'
import * as mutations from './uav_common_mutations'

export const state = {
  projects: {
    project_list: [],
    last_key: null,
    forceStart: true
  },
  check_groups: [
    {
      group_name: 'Check Initialization',
      group_id: 0,
      is_checked: true,
      checks: [
        { id: 'EF1B21B3-8E2C-41D3-93CE-F9D73813B076', name: 'Check Initialization', is_running: false, progress: 0, is_checked: true }
      ]
    },
    {
      group_name: 'Coordinate Systems & Attributes',
      group_id: 1,
      is_checked: false,
      checks: [
        { id: 'C9D2B796-C1A4-44BE-9736-33F6BFC7196E', name: 'Horizontal Coordinate Systems of Spatial Files', is_running: false, progress: 0, is_checked: false },
        { id: '6A837F4F-F56F-4028-B1B7-68F421F72F1A', name: 'Another Check', is_running: false, progress: 0, is_checked: false}
      ]
    }
  ]
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
