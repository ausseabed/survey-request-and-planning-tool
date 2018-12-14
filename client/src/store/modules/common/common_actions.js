import Vue from 'vue'
import { EventBus } from './../../../event-bus';

export const saveDataset = ({ commit, state }, payload) => {
  var axiosAction = payload.id ? Vue.axios.put : Vue.axios.post;

  return axiosAction('/api/dataset/' + payload.type + (payload.id ? ('/' + payload.id) : ''), payload)
    .then((response) => {
      if (payload.type === 'custom') { commit('addCustomDataset', response.data); }
      else if (payload.type === 'standard') { commit('addStandardDataset', response.data); }

      EventBus.$emit('redirect', '/uav/tender');
      return null;
    })
}

export const loadDataset = ({ commit, state }, payload) => {
  return Vue.axios.get('/api/dataset/' + payload.type)
    .then((response) => {
      if (payload.type === 'custom') { commit('clearCustomDataset'); }
      else if (payload.type === 'standard') { commit('clearStandardDataset'); }

      return _.each(response.data, (d) => {
        if (payload.type === 'custom') { commit('addCustomDataset', d); }
        else if (payload.type === 'standard') { commit('addStandardDataset', d); }
      })
    })
}

export const deleteDataset = ({ commit, state}, payload) => {
  return Vue.axios.delete('/api/dataset/' + payload.type + '/' + payload.id)
    .then((response) => {
      if (payload.type === 'custom') { commit('removeCustomDataset', payload.id); }
      else if (payload.type === 'standard') { commit('removeStandardDataset', payload.id); }

      EventBus.$emit('redirect', '/uav/tender');
      return null;
    })
}
