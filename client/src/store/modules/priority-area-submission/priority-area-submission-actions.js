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
        commit(mutTypes.SET_RESTORE_PRIORITY_AREA_SUBMISSION, response.data);
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
    Vue.axios.get(url_endpoint, { params: params })
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

async function getOptions(commit, optionsType, setMutatation) {
  const urlEndpoint = `/api/priority-area-submission/${optionsType}`;

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  try {
    const response = await Vue.axios.get(urlEndpoint);
    const options = response.data;

    commit(setMutatation, options);
  } catch (error) {
    commit(mutTypes.SET_REQUEST_ERROR, error);
    console.log(error);
  }
}

export const getPreferredTimeframeOptions = async ({ commit, state }) => {
  getOptions(
    commit,
    'preferred-timeframe-options',
    mutTypes.SET_PREFERRED_TIMEFRAME_OPTIONS
  );
}

export const getPriorityOptions = async ({ commit, state }) => {
  getOptions(
    commit,
    'priority-options',
    mutTypes.SET_PRIORITY_OPTIONS
  );
}

export const getRequiredDataQualityOptions = async ({ commit, state }) => {
  getOptions(
    commit,
    'required-data-quality-options',
    mutTypes.SET_REQUIRED_DATA_QUALITY_OPTIONS
  );
}

export const getRiskRatingOptions = async ({ commit, state }) => {
  getOptions(
    commit,
    'risk-rating-options',
    mutTypes.SET_RISK_RATING_OPTIONS
  );
}

export const getIdentifiedAreaOptions = async ({ commit, state }) => {
  getOptions(
    commit,
    'identified-area-options',
    mutTypes.SET_IDENTIFIED_AREA_OPTIONS
  );
}

export const getGeographicalAreaOptions = async ({ commit, state }) => {
  getOptions(
    commit,
    'geographical-area-options',
    mutTypes.SET_GEOGRAPHICAL_AREA_OPTIONS
  );
}

export const getEcologicalAreaNameOptions = async ({ commit, state }) => {
  getOptions(
    commit,
    'ecological-area-options',
    mutTypes.SET_ECOLOGICAL_AREA_NAME_OPTIONS
  );
}

export const getSeacountryNameOptions = async ({ commit, state }) => {
  getOptions(
    commit,
    'seacountry-options',
    mutTypes.SET_SEACOUNTRY_NAME_OPTIONS
  );
}
