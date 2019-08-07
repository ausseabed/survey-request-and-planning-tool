import Vue from 'vue'

import * as mutTypes from './custodian-mutation-types'
import { RequestStatus } from '../request-status'

export const saveCustodian = ({ commit, state }, payload) => {

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  return new Promise((resolve, reject) => {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);
    Vue.axios.post('/api/custodian', payload)
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

export const getCustodians = ({ commit, state }) => {
  var url_endpoint = '/api/custodian/';

  const params = {};
  if (!_.isNil(state.deletedCustodians)) {
    params.deleted = state.deletedCustodians;
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

export const deleteCustodian = ({ commit, state }, payload) => {
  var url_endpoint = '/api/custodian/' + payload.id;

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

export const restoreCustodian = ({ commit, state }, custodianId) => {
  // uses the same post request handler as save, but only passes the custodianid
  // and deleted flag
  const payload = {
    id: custodianId,
    deleted: false,
  }

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  return new Promise((resolve, reject) => {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);
    Vue.axios.post('/api/custodian', payload)
    .then((response) => {
      // add custodian in this case will update the custodian already in the list
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

export const getUserCustodian = ({ commit, state }) => {
  var url_endpoint = '/api/custodian/user-custodian';

  const params = {};

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  return new Promise((resolve, reject) => {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);
    Vue.axios.get(url_endpoint, {params: params})
    .then((response) => {
      commit(mutTypes.SET_USER_ORGANISATION, response.data);
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
