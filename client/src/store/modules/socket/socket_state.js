import * as actions from './socket_actions'
import * as getters from './socket_getters'
import * as mutations from './socket_mutations'

export const state = {
  "id": null,
  "connected": false,
  "authenticated": false,
  "message": null
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
