import Vue from 'vue'

import * as mutTypes from './request-purpose-mutation-types'
import { RequestStatus } from '../request-status'


export const getRequestPurposes = async ({ commit, state }) => {
  const urlEndpoint = `/api/request-purpose`;

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  try {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);

    const response = await Vue.axios.get(urlEndpoint);
    let requestPurposes = response.data;

    commit(mutTypes.UPDATE, {path: 'requestPurposes', value: requestPurposes});
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.SUCCESS);
  } catch (error) {
    commit(mutTypes.SET_REQUEST_ERROR, error);
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.ERROR);
    console.log(error);
  }
}
