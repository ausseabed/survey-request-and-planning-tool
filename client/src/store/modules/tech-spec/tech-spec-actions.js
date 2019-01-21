import Vue from 'vue'

import * as mutTypes from './tech-spec-mutation-types'
import { RequestStatus } from './tech-spec-state'

export const getTechSpec = async ({ commit, state }, payload) => {
  const urlEndpoint = '/api/tech-spec/' + payload.id;

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  try {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);

    const response = await Vue.axios.get(urlEndpoint);
    const techSpec = response.data;

    commit(mutTypes.UPDATE, {path: 'techSpec', value: techSpec});
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.SUCCESS);
  } catch (error) {
    commit(mutTypes.SET_REQUEST_ERROR, error);
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.ERROR);
    console.log(error);
  }
}


export const saveTechSpec = async ({ commit, state }) => {
  const urlEndpoint = '/api/tech-spec/';

  commit(mutTypes.SET_REQUEST_ERROR, undefined);

  try {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);

    const resonse = await Vue.axios.post(urlEndpoint, state.techSpec);
    const techSpec = response.data;

    commit(mutTypes.UPDATE, {path: 'techSpec', value: techSpec});
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.SUCCESS);
  } catch (error) {
    commit(mutTypes.SET_REQUEST_ERROR, error);
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.ERROR);
    console.log(error);
  }
}
