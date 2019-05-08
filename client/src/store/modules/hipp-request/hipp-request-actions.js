import Vue from 'vue'

import * as mutTypes from './hipp-request-mutation-types'
import { RequestStatus } from '../request-status'

export const getHippRequest = async ({ commit, state }, payload) => {
  const urlEndpoint = '/api/hipp-request/' + payload.id;

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  try {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);

    const response = await Vue.axios.get(urlEndpoint);
    const hippRequest = response.data;

    commit(mutTypes.UPDATE, {path: 'hippRequest', value: hippRequest});
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.SUCCESS);
    commit(mutTypes.SET_DIRTY, false);
  } catch (error) {
    commit(mutTypes.SET_REQUEST_ERROR, error);
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.ERROR);
    console.log(error);
  }
}

export const getHippRequests = async ({ commit, state }) => {
  const urlEndpoint = '/api/hipp-request/';

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  try {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);

    const response = await Vue.axios.get(urlEndpoint);
    const hippRequests = response.data;

    commit(mutTypes.UPDATE, {path: 'hippRequests', value: hippRequests});
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.SUCCESS);
    commit(mutTypes.SET_DIRTY, false);
  } catch (error) {
    commit(mutTypes.SET_REQUEST_ERROR, error);
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.ERROR);
    console.log(error);
  }
}



export const saveHippRequest = async ({ commit, state }) => {
  const urlEndpoint = '/api/hipp-request/';

  commit(mutTypes.SET_REQUEST_ERROR, undefined);

  return new Promise((resolve, reject) => {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);
    Vue.axios.post(urlEndpoint, state.hippRequest)
    .then((response) => {
      const hippRequest = response.data;

      commit(mutTypes.UPDATE, {path: 'hippRequest', value: hippRequest});
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
