import Vue from 'vue'

export const getTenderList = ({ getters, commit }, { done, stop }) => {
  if (getters.forceStartOn === true) {
    commit('clearProjectList', {});
  }

  var response = Vue.axios.get('/api/uav/tender', {
    params: getters.lastEvaluatedKey
  })
    .then((response) => {
      commit("turnProjectForceOn", false);
      commit('AddProjectsToList', response.data.items);
      commit('setProjectLastKey', response.data.last_key ? response.data.last_key : null);
      if (done) done();
      if (stop && !getters.forceStartOn && getters.lastEvaluatedKey === null) stop();
      return null;
    })
    .catch((error) => {
      console.error(error.response);
      return null;
    });
}
