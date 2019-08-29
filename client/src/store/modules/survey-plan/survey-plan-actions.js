import Vue from 'vue'
import { EventBus } from './../../../event-bus';
import _ from 'lodash';

import * as mutTypes from './survey-plan-mutation-types'
import { RequestStatus } from '../request-status'

export const checkAoi = ({ commit, state }, payload) => {

  const cfg = {
    params: {
      'ignore-id': payload.id
    }
  }
  return new Promise((resolve, reject) => {
    Vue.axios
    .post('/api/check-aoi', state.surveyPlan.areaOfInterest, cfg)
    .then((response) => {
      resolve(response.data);
    })
    .catch((error) => {
      reject(error);
    });
  });
}

export const save = ({ commit, state }) => {
  console.log('saving survey plan metadata');
  console.log(state);

  return new Promise((resolve, reject) => {
    Vue.axios.post('/api/project-metadata', state.surveyPlan)
    .then((response) => {
      commit(mutTypes.UPDATE, { path: 'surveyPlan', value: response.data })
      resolve(response.data);
    })
    .catch((error) => {
      reject(error);
    });
  });
}

export const deleteSurveyPlan = ({ commit, state }, payload) => {
  var url_endpoint = '/api/project-metadata/' + payload.id;
  return new Promise((resolve, reject) => {
    Vue.axios.delete(url_endpoint)
    .then((response) => {
      commit(mutTypes.RESET);
      resolve();
    })
    .catch((error) => {
      reject(error);
    });
  });
}

export const getSurveyPlan = ({ commit, state }, payload) => {
  var url_endpoint = '/api/project-metadata/' + payload.id;
  if (payload.version) { url_endpoint += "?version=" + payload.version }

  return new Promise((resolve, reject) => {
    Vue.axios.get(url_endpoint)
    .then((response) => {
      commit(mutTypes.RESET_PROJECT_METADATA)
      commit(mutTypes.UPDATE, { path: 'surveyPlan', value: response.data })
      commit(mutTypes.SET_DIRTY, false);
      resolve(response.data);
    })
    .catch((error) => {
      reject(error);
    });
  });

}

export const getSurveyPlanList = ({ commit, state }, payload) => {
  commit(mutTypes.SET_REQUEST_ERROR, undefined);

  var url_endpoint = '/api/project-metadata/';
  var getConfig = _.isNil(payload) ? {} : payload;
  if (!_.isNil(state.surveyPlanListFilter)) {
    let params = {params: state.surveyPlanListFilter};
    _.merge(getConfig, params);
  }

  return new Promise(async (resolve, reject) => {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);
    Vue.axios.get(url_endpoint, getConfig)
    .then((response) => {
      commit(mutTypes.SET_PROJECT_METADATA_LIST, response.data)
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

export const getSurveyPlanStatuses = ({ commit, state }) => {
  var url_endpoint = '/api/project-metadata/valid-statuses';

  return Vue.axios.get(url_endpoint)
  .then((response) => {
    commit(mutTypes.SET_PROJECT_STATUSES, response.data);
  })
}
