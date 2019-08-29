import Vue from 'vue'

import * as mutTypes from './survey-request-mutation-types'
import { RequestStatus } from '../request-status'

export const getSurveyRequest = async ({ commit, state }, payload) => {
  const urlEndpoint = '/api/hipp-request/' + payload.id;

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  try {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);

    const response = await Vue.axios.get(urlEndpoint);
    const surveyRequest = response.data;
    surveyRequest.areaOfInterest = Object.freeze(surveyRequest.areaOfInterest);
    commit(mutTypes.UPDATE, {path: 'surveyRequest', value: surveyRequest});
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.SUCCESS);
    commit(mutTypes.SET_DIRTY, false);
  } catch (error) {
    commit(mutTypes.SET_REQUEST_ERROR, error);
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.ERROR);
    console.log(error);
  }
}

export const getSurveyRequests = async ({ commit, state }) => {
  const urlEndpoint = '/api/hipp-request/';

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  try {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);

    const response = await Vue.axios.get(urlEndpoint);
    const surveyRequests = response.data;

    commit(mutTypes.UPDATE, {path: 'surveyRequests', value: surveyRequests});
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.SUCCESS);
    commit(mutTypes.SET_DIRTY, false);
  } catch (error) {
    commit(mutTypes.SET_REQUEST_ERROR, error);
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.ERROR);
    console.log(error);
  }
}



export const saveSurveyRequest = async ({ commit, state }) => {
  const urlEndpoint = '/api/hipp-request/';

  commit(mutTypes.SET_REQUEST_ERROR, undefined);

  return new Promise((resolve, reject) => {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);
    Vue.axios.post(urlEndpoint, state.surveyRequest)
    .then((response) => {
      const surveyRequest = response.data;

      commit(mutTypes.UPDATE, {path: 'surveyRequest', value: surveyRequest});
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


export const updatePlanLinks = async ({ commit, state }, payload) => {
  const urlEndpoint = `/api/hipp-request/${payload.id}/linked-plans`;
  const linkedPlans = payload.linkedPlans

  commit(mutTypes.SET_REQUEST_ERROR, undefined);

  return new Promise((resolve, reject) => {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);
    Vue.axios.post(urlEndpoint, linkedPlans)
    .then((response) => {
      const surveyRequest = response.data;

      // commit(mutTypes.UPDATE, {path: 'surveyRequest', value: surveyRequest});
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


export const deleteSurveyRequest = ({ commit, state }, payload) => {
  var url_endpoint = '/api/hipp-request/' + payload.id;
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


export const getRiskMatrix = ({ commit, state }) => {
  var url_endpoint = '/api/hipp-request/risk-matrix';

  return Vue.axios.get(url_endpoint)
  .then((response) => {
    commit(mutTypes.SET_RISK_MATRIX, response.data);
  })
}

export const getGeojsonAttributeMap = ({ commit, state }) => {
  var url_endpoint = '/api/hipp-request/geojson-attribute-map';

  return Vue.axios.get(url_endpoint)
  .then((response) => {
    commit(mutTypes.SET_GEOJSON_ATTRIBUTE_MAP, response.data);
  })
}

export const getChartProductQualityImpactRequirements = ({ commit, state }) => {
  var url_endpoint = '/api/hipp-request/chart-product-quality-impact-requirements';

  return Vue.axios.get(url_endpoint)
  .then((response) => {
    commit(
      mutTypes.SET_CHART_PRODUCT_QUALITY_IMPACT_REQUIREMENTS,
      response.data
    );
  })
}

export const getSurveyQualityRequirements = ({ commit, state }) => {
  var url_endpoint = '/api/hipp-request/survey-quality-requirements';

  return Vue.axios.get(url_endpoint)
  .then((response) => {
    commit(mutTypes.SET_SURVEY_QUALITY_REQUIREMENTS, response.data);
  })
}
