import Vue from 'vue'
import { EventBus } from './../../../../event-bus';

export const checkAoi = ({ commit, state }, payload) => {
  Vue.axios
  .post('/api/check-aoi', state.areaOfInterest)
  .then((response) => {
    console.log(response);
  })
}

export const save = ({ commit, state }) => {
  console.log('saving project metadata');
  console.log(state);

  Vue.axios.post('/api/project-metadata', state)
  .then((response) => {
    commit('replace', response.data);
  })
  .catch((error) => {
    console.log(error)
  });
}

export const getProjectMetadata = ({ commit, state }, payload) => {
  var url_endpoint = '/api/project-metadata/' + payload.id;
  if (payload.version) { url_endpoint += "?version=" + payload.version }

  return Vue.axios.get(url_endpoint)
    .then((response) => {
      commit('replace', response.data);
    })
}
