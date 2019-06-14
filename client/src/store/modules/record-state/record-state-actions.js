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
