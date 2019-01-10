import Vue from 'vue'
import { EventBus } from './../../../event-bus';

// export const saveInstrumentType = ({ commit, state }, payload) => {
//
//   return new Promise((resolve, reject) => {
//     Vue.axios.post('/api/instrument-type', payload)
//     .then((response) => {
//       commit('addInstrumentType', response.data);
//       resolve(response.data);
//     })
//     .catch((error) => {
//       reject(error);
//     });
//   });
// }

export const getDataCaptureTypes = ({ commit, state }, payload) => {
  var url_endpoint = '/api/data-capture-type/';

  return Vue.axios.get(url_endpoint, payload)
  .then((response) => {
    commit('setDataCaptureTypes', response.data);
  })
}
