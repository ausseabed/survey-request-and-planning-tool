import Vue from 'vue'
import { EventBus } from './../../../event-bus';

export const checkAoi = ({ commit, state }, payload) => {
  return new Promise((resolve, reject) => {
    Vue.axios
    .post('/api/check-aoi', state.projectMetadata.areaOfInterest)
    .then((response) => {
      resolve(response.data);
    })
    .catch((error) => {
      reject(error);
    });
  });
}

export const save = ({ commit, state }) => {
  console.log('saving project metadata');
  console.log(state);

  return new Promise((resolve, reject) => {
    Vue.axios.post('/api/project-metadata', state.projectMetadata)
    .then((response) => {
      commit('update', { path: 'projectMetadata', value: response.data })
      resolve(response.data);
    })
    .catch((error) => {
      reject(error);
    });
  });
}

export const getProjectMetadata = ({ commit, state }, payload) => {
  var url_endpoint = '/api/project-metadata/' + payload.id;
  if (payload.version) { url_endpoint += "?version=" + payload.version }

  return new Promise((resolve, reject) => {
    Vue.axios.get(url_endpoint)
    .then((response) => {
      commit('update', { path: 'projectMetadata', value: response.data })
      resolve(response.data);
    })
    .catch((error) => {
      reject(error);
    });
  });

}
