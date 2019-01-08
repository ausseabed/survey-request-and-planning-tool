import Vue from 'vue'
import { EventBus } from './../../../event-bus';

export const saveOrganisation = ({ commit, state }, payload) => {
  console.log('saving organisation');
  console.log(state);

  return new Promise((resolve, reject) => {
    Vue.axios.post('/api/organisation', payload)
    .then((response) => {
      commit('addOrganisation', response.data);
      resolve(response.data);
    })
    .catch((error) => {
      reject(error);
    });
  });
}

export const getOrganisations = ({ commit, state }) => {
  var url_endpoint = '/api/organisation/';

  return Vue.axios.get(url_endpoint)
  .then((response) => {
    commit('setOrganisations', response.data);
  })
}
