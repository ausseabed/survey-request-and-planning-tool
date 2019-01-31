import Vue from 'vue'

import * as mutTypes from './deliverable-mutation-types'
import { RequestStatus } from '../request-status'

export const getDefinitionList = async ({ commit, state }) => {
  const urlEndpoint = '/api/deliverable/definition-list';

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  try {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);

    const response = await Vue.axios.get(urlEndpoint);
    const list = response.data;

    commit(mutTypes.SET_DEFINITION_LIST, list);
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.SUCCESS);
  } catch (error) {
    commit(mutTypes.SET_REQUEST_ERROR, error);
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.ERROR);
    console.log(error);
  }
}
