import Vue from 'vue'

import * as mutTypes from './survey-request-mutation-types'
import { RequestStatus } from '../request-status'

export const getSurveyRequest = async ({ commit, state }, payload) => {
  const urlEndpoint = '/api/survey-request/' + payload.id;

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

export const getSurveyRequests = async ({ commit, state }, payload) => {
  const urlEndpoint = '/api/survey-request/';

  var getConfig = _.isNil(payload) ? {} : payload;
  if (!_.isNil(state.surveyPlansFilter)) {
    let params = {params: state.surveyPlansFilter};
    _.merge(getConfig, params);
  }

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  try {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);

    const response = await Vue.axios.get(urlEndpoint, getConfig);
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
  const urlEndpoint = '/api/survey-request/';

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


export const deleteSurveyRequest = ({ commit, state }, payload) => {
  var url_endpoint = '/api/survey-request/' + payload.id;
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


export const getDataTypes = ({ commit, state }) => {
  var url_endpoint = '/api/survey-request-aoi/data-type';

  return Vue.axios.get(url_endpoint)
  .then((response) => {
    commit(mutTypes.SET_DATA_TYPES, response.data);
  })
}

export const getSurveyStandard = ({ commit, state }) => {
  var url_endpoint = '/api/survey-request-aoi/survey-standard';

  return Vue.axios.get(url_endpoint)
  .then((response) => {
    commit(mutTypes.SET_SURVEY_STANDARDS, response.data);
  })
}

export const getPreferredTimeframe = ({ commit, state }) => {
  var url_endpoint = '/api/survey-request-aoi/preferred-timeframe';

  return Vue.axios.get(url_endpoint)
  .then((response) => {
    commit(
      mutTypes.SET_PREFERRED_TIMEFRAMES,
      response.data
    );
  })
}

export const getOverallRisk = ({ commit, state }) => {
  var url_endpoint = '/api/survey-request-aoi/overall-risk';

  return Vue.axios.get(url_endpoint)
  .then((response) => {
    commit(mutTypes.SET_OVERALL_RISKS, response.data);
  })
}

export const getGeojsonAttributeMap = ({ commit, state }) => {
  var url_endpoint = '/api/survey-request/geojson-attribute-map';

  return Vue.axios.get(url_endpoint)
  .then((response) => {
    commit(mutTypes.SET_GEOJSON_ATTRIBUTE_MAP, response.data);
  })
}
