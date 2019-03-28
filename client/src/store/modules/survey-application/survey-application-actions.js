import Vue from 'vue'
import { EventBus } from './../../../event-bus';

export const getSurveyApplications = ({ commit, state }) => {
  var url_endpoint = '/api/survey-application/';
  const payload = state.selectedSurveyApplicationGroup ?
    {params:{
      group: state.selectedSurveyApplicationGroup,
      "user-submitted":false
    }} :
    {}

  return new Promise((resolve, reject) => {
    Vue.axios.get(url_endpoint, payload)
    .then((response) => {
      commit('setSurveyApplications', response.data);
      resolve(response.data);
    })
    .catch((error) => {
      reject(error);
    });
  });
}

export const getSurveyApplicationGroups = ({ commit, state }) => {
  var url_endpoint = '/api/survey-application/group-names';
  const payload = {
    params:{
      "user-submitted":false
    }
  }

  return new Promise((resolve, reject) => {
    Vue.axios.get(url_endpoint, payload)
    .then((response) => {
      commit('setSurveyApplicationGroups', response.data);
      resolve(response.data);
    })
    .catch((error) => {
      reject(error);
    });
  });
}
