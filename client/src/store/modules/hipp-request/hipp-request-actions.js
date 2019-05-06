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


export const saveHippRequest = async ({ commit, state }) => {
  const urlEndpoint = '/api/hipp-request/';

  commit(mutTypes.SET_REQUEST_ERROR, undefined);

  try {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);

    const response = await Vue.axios.post(urlEndpoint, state.techSpec);
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
