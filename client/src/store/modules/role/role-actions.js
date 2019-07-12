import Vue from 'vue'

import * as mutTypes from './role-mutation-types'
import { RequestStatus } from '../request-status'

export const getRoles = ({ commit, state }) => {
  var url_endpoint = '/api/role/';

  const params = {};
  if (!_.isNil(state.deletedRoles)) {
    params.deleted = state.deletedRoles;
  }

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  return new Promise((resolve, reject) => {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);
    Vue.axios.get(url_endpoint, {params: params})
    .then((response) => {
      commit(mutTypes.SET_ROLES, response.data);
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

export const getPermissions = ({ commit, state }) => {
  var url_endpoint = '/api/role/permissions';

  return Vue.axios.get(url_endpoint)
  .then((response) => {
    commit(mutTypes.SET_PERMISSIONS, response.data);
  })
}

export const saveRole = ({ commit, state }, payload) => {
  var url_endpoint = '/api/role/';

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  return new Promise((resolve, reject) => {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);
    Vue.axios.post(url_endpoint, payload)
    .then((response) => {
      commit(mutTypes.ADD_ROLE, response.data);
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

export const getUserRole = ({ commit, state }) => {
  var url_endpoint = '/api/role/user-role';

  const params = {};

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  return new Promise((resolve, reject) => {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);
    Vue.axios.get(url_endpoint, {params: params})
    .then((response) => {
      commit(mutTypes.SET_USER_ROLE, response.data);
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
