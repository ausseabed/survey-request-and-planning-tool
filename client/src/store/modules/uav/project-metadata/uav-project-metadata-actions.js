import Vue from 'vue'
import { EventBus } from './../../../../event-bus';

export const checkAoi = ({ commit, state }, payload) => {
  Vue.axios
  .post('/api/check-aoi', state.areaOfInterest)
  .then((response) => {
    console.log(response);
  })
}
