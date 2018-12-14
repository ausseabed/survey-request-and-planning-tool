import Vue from 'vue'
import { EventBus } from './../../../../event-bus';

export const getProject = ({ commit, state, dispatch }, payload) => {
  return Vue.axios.get('/api/uav/project/' + payload.id)
    .then((project) => {
      commit('replace', _.merge(project.data, {
        current_session: null
      }));
      return project;
    })
    .then((project) => {
      if (payload.session_id) {
        return dispatch('getSession', payload);
      }
      return null;
    })
    .catch((error) => {
      EventBus.$emit('redirect', '/uav');
    });
}

export const getSession = ({ commit, state }, payload) => {
  return Vue.axios.get('/api/uav/' + payload.id + '/session/' + payload.session_id)
    .then((response) => {
      if (payload.no_save) {
        return response.data;
      }
      else {
        return commit('update', { path: 'current_session', value: response.data });
      }
    })
    .catch((error) => {
      EventBus.$emit('redirect', '/uav');
    });
}

export const deleteProject = ({ commit, state }, payload) => {
  return Vue.axios.delete('/api/uav/project/' + payload.id)
    .then((response) => {
      commit('uav_common/removeProjectFromList', payload.id, { root: true });
      EventBus.$emit('redirect', '/uav');
    })
}

export const deleteSession = ({ commit }, payload) => {
  return Vue.axios.delete('/api/uav/' + payload.id + '/session/' + payload.session_id)
    .then((response) => {
      commit('uav_project/removeSession', { id: payload.id, session_id: payload.session_id }, { root: true });
      commit('uav_common/removeSessionFromProject', { id: payload.id, session_id: payload.session_id }, { root: true });
    })
}
