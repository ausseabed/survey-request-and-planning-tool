export const socket_connect = ({ commit }, payload) => {
  commit("set_connected", true);
}

export const socket_disconnect = ({ commit }, payload) => {
  commit("set_connected", false);
}

export const socket_authenticated = ({ commit }, payload) => {
  commit("set_authenticated", true);
}

export const socket_unauthorized = ({ commit }, payload) => {
  commit("set_authenticated", false);
}

export const socket_taskScheduled = ({ dispatch }, payload) => {
  dispatch('task/startTask', payload, { root: true });
}

export const socket_taskStatus = ({ dispatch }, payload) => {
  dispatch('task/taskStatus', payload, { root: true });
}

export const socket_processStatus = ({ dispatch }, payload) => {
  dispatch('task/processStatus', payload, { root: true });
}

export const socket_taskError = ({ dispatch }, logId) => {
  console.log(logId);
}

export const socket_taskCancelled = ({ dispatch }, payload) => {
  dispatch('task/taskStatus', payload, { root: true });
}
