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
