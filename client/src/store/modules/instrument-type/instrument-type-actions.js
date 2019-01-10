import Vue from 'vue'
import { EventBus } from './../../../event-bus';

export const saveInstrumentType = ({ commit, state }, payload) => {

  return new Promise((resolve, reject) => {
    Vue.axios.post('/api/instrument-type', payload)
    .then((response) => {
      commit('addInstrumentType', response.data);
      resolve(response.data);
    })
    .catch((error) => {
      reject(error);
    });
  });
}

export const getInstrumentTypes = ({ commit, state }, payload) => {
  var url_endpoint = '/api/instrument-type/';

  return Vue.axios.get(url_endpoint, payload)
  .then((response) => {
    commit('setInstrumentTypes', response.data);
  })
}
