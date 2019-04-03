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

export const getOrganisations = ({ commit, state }) => {
  var url_endpoint = '/api/organisation/';

  const params = {};
  if (!_.isNil(state.deletedOrganisations)) {
    params.deleted = state.deletedOrganisations;
  }

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  return new Promise((resolve, reject) => {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);
    Vue.axios.get(url_endpoint, {params: params})
    .then((response) => {
      commit(mutTypes.SET_ORGANISATIONS, response.data);
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
  var url_endpoint = '/api/organisation/' + payload.id;

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  return new Promise((resolve, reject) => {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);
    Vue.axios.delete(url_endpoint)
    .then((response) => {
      commit(mutTypes.ADD_ORGANISATION, response.data);
      commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.SUCCESS);
      resolve();
    })
    .catch((error) => {
      commit(mutTypes.SET_REQUEST_ERROR, error);
      commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.ERROR);
      reject(error);
    });
  });
}

export const restoreOrganisation = ({ commit, state }, organisationId) => {
  // uses the same post request handler as save, but only passes the orgid
  // and deleted flag
  const payload = {
    id: organisationId,
    deleted: false,
  }

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  return new Promise((resolve, reject) => {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);
    Vue.axios.post('/api/organisation', payload)
    .then((response) => {
      // add organisation in this case will update the org already in the list
      commit(mutTypes.ADD_ORGANISATION, response.data);
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
