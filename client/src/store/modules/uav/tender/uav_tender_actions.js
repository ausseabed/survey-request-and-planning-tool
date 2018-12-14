import Vue from 'vue'
import { EventBus } from './../../../../event-bus';

export const saveTender = ({ commit, state }) => {
  Vue.axios.post('/api/uav/tender', state)
    .then((response) => {
      commit('replace', response.data);
    })
    .catch((error) => {
      console.log(error)
    });
}

export const saveSurveyAnswers = ({ commit, state }, payload) => {
  return Vue.axios.post('/api/survey', payload)
    .then((response) => {
      commit('reset');                                                          // Reset tender state
      var cloned_state =  _.merge(_.cloneDeep(state), response.data);           // clone the state & merge with response
      commit('replace', cloned_state);                                          // replace the cloned state as current state
      if (response.data.id) { commit('update', { path: 'id', value: response.data.id }) }
      EventBus.$emit('redirect', '/uav/tender');
      return null;
    })
}

export const getTender = ({ commit, state }, payload) => {
  var url_endpoint = '/api/uav/tender/' + payload.id;
  if (payload.version) { url_endpoint += "?version=" + payload.version }

  return Vue.axios.get(url_endpoint)
    .then((response) => {
      commit('replace', response.data);
    })
}

export const putAoi = ({ commit, state }, payload) => {
  Vue.axios.post('/api/signedurl', {
    file_name: 'uav/requirements/' + payload.id + '/assets/aoi.geojson',
    content_type: 'application/json'
  })
    .then((response) => {
      return Vue.axios.put(response.data.url, payload.geojson, {
        transformRequest: [
          (data, headers) => {
            delete headers.Authorization
            return data
          }],
        headers: {
          'Content-Type': 'application/json',
          'x-amz-acl': 'bucket-owner-full-control'
        }
      })
        .then((response) => {
          //uploaded_files.push({ file: file });
          return commit('addAoi');
        })
    })
}
