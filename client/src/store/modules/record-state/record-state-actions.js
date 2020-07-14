import Vue from 'vue'

import * as mutTypes from './record-state-mutation-types'
import { RequestStatus } from '../request-status'


export const getRecordState = async ({ commit, state }) => {
  const urlEndpoint = `/api/record-state/${state.entityType}/${state.entityId}`;

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  try {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);

    const response = await Vue.axios.get(urlEndpoint);
    let recordState = response.data;

    commit(mutTypes.UPDATE, {path: 'recordState', value: recordState});
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.SUCCESS);
  } catch (error) {
    commit(mutTypes.SET_REQUEST_ERROR, error);
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.ERROR);
    console.log(error);
  }
}

export const transitionRecordState = ({ commit, state }, event) => {
  const urlEndpoint = `/api/record-state/${state.entityType}/${state.entityId}`;

  const payload = {nextEvent: event}

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  return new Promise((resolve, reject) => {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);
    Vue.axios.post(urlEndpoint, payload)
    .then((response) => {
      let recordState = response.data;
      commit(mutTypes.UPDATE, {path: 'recordState', value: recordState});
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
