import Vue from 'vue'

import * as mutTypes from './organisation-mutation-types'
import { RequestStatus } from '../request-status'

export const saveOrganisation = ({ commit, state }, payload) => {

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  return new Promise((resolve, reject) => {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);
    Vue.axios.post('/api/organisation', payload)
    .then((response) => {
      commit(mutTypes.ADD_ORGANISATION, response.data);
      commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.SUCCESS);
      commit(mutTypes.SET_DIRTY, false);
      resolve(response.data);
    })
    .catch((error) => {
      commit(mutTypes.SET_REQUEST_ERROR, error);
      commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.ERROR);
      reject(error);
    });
  });
}

export const getActiveOrganisation = ({ commit, state }, id) => {
  var url_endpoint = `/api/organisation/${id}`;

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  return new Promise((resolve, reject) => {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);
    Vue.axios.get(url_endpoint)
    .then((response) => {
      commit(mutTypes.SET_ACTIVE_ORGANISATION, response.data);
      commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.SUCCESS);
      resolve(response.data);
    })
    .catch((error) => {
      commit(mutTypes.SET_REQUEST_ERROR, error);
      commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.ERROR);
      reject(error);
    });
  });
}

export const getOrganisations = ({ commit, state }) => {
  var url_endpoint = '/api/organisation/';

  const params = {};
  params.limit = state.pageSize;
  params.start = state.organisations.length;
  if (!_.isNil(state.filter)) {
    params.filter = state.filter;
  }

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  return new Promise((resolve, reject) => {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);
    Vue.axios.get(url_endpoint, {params: params})
    .then((response) => {
      commit(mutTypes.SET_PAGE_DATA, response.data);
      commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.SUCCESS);
      resolve(response.data);
    })
    .catch((error) => {
      commit(mutTypes.SET_REQUEST_ERROR, error);
      commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.ERROR);
      reject(error);
    });
  });
}

export const deleteOrganisation = ({ commit, state }, payload) => {
  const id = payload.id;
  var url_endpoint = `/api/organisation/${id}`;

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  return new Promise((resolve, reject) => {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);
    Vue.axios.delete(url_endpoint)
    .then((response) => {
      commit(mutTypes.REMOVE_ORGANISATION, id);
      if (!_.isNil(state.activeOrganisation) && state.activeOrganisation.id == id) {
        commit(mutTypes.SET_ACTIVE_ORGANISATION, undefined);
      }
      commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.SUCCESS);
      resolve(response.data);
    })
    .catch((error) => {
      commit(mutTypes.SET_REQUEST_ERROR, error);
      commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.ERROR);
      reject(error);
    });
  });
}
