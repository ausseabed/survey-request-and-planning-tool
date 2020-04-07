import Vue from 'vue'

import * as mutTypes from './priority-area-submission-mutation-types'
import { RequestStatus } from '../request-status'

export const savePriorityAreaSubmission = ({ commit, state }, payload) => {

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  return new Promise((resolve, reject) => {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);
    Vue.axios.post('/api/priority-area-submission', payload)
    .then((response) => {
      commit(mutTypes.ADD_PRIORITY_AREA_SUBMISSION, response.data);
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

export const getActivePriorityAreaSubmission = ({ commit, state }) => {
  var id = state.activePriorityAreaSubmission.id;
  var url_endpoint = `/api/priority-area-submission/${id}`;

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  return new Promise((resolve, reject) => {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);
    Vue.axios.get(url_endpoint)
    .then((response) => {
      commit(mutTypes.SET_ACTIVE_PRIORITY_AREA_SUBMISSION, response.data);
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

export const getPriorityAreaSubmissions = ({ commit, state }) => {
  var url_endpoint = '/api/priority-area-submission/';

  const params = {};
  params.limit = state.pageSize;
  params.start = state.priorityAreaSubmissions.length;
  if (!_.isNil(state.filter)) {
    params.filter = state.filter;
  }

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  return new Promise((resolve, reject) => {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);
    Vue.axios.get(url_endpoint, {params: params})
    .then((response) => {
      commit(mutTypes.SET_PAGE_DATA, response.data);
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

export const deletePriorityAreaSubmission = ({ commit, state }, payload) => {
  const id = payload.id;
  var url_endpoint = `/api/priority-area-submission/${id}`;

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  return new Promise((resolve, reject) => {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);
    Vue.axios.delete(url_endpoint)
    .then((response) => {
      commit(mutTypes.REMOVE_PRIORITY_AREA_SUBMISSION, id);
      if (!_.isNil(state.activePriorityAreaSubmission) && state.activePriorityAreaSubmission.id == id) {
        commit(mutTypes.SET_ACTIVE_PRIORITY_AREA_SUBMISSION, undefined);
      }
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
