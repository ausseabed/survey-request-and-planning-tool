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

    const response = await Vue.axios.post(urlEndpoint, state.techSpec);
    const techSpec = response.data;

    commit(mutTypes.UPDATE, {path: 'techSpec', value: techSpec});
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.SUCCESS);
  } catch (error) {
    commit(mutTypes.SET_REQUEST_ERROR, error);
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.ERROR);
    console.log(error);
  }
}


export const getValidSurveyTypes = async ({ commit, state }, payload) => {
  const urlEndpoint = '/api/tech-spec/valid-types';

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  try {
    const response = await Vue.axios.get(urlEndpoint);
    const stypes = response.data;

    commit(mutTypes.SET_VALID_SURVEY_TYPES, stypes);
  } catch (error) {
    commit(mutTypes.SET_REQUEST_ERROR, error);
    console.log(error);
  }
}

export const getValidSurveyClassifications =
  async ({ commit, state }, payload) => {

  const urlEndpoint = '/api/tech-spec/valid-classifications';

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  try {
    const response = await Vue.axios.get(urlEndpoint);
    const sclas = response.data;

    commit(mutTypes.SET_VALID_SURVEY_CLASSIFICATIONS, sclas);
  } catch (error) {
    commit(mutTypes.SET_REQUEST_ERROR, error);
    console.log(error);
  }
}

export const getValidGroundTruthingMethods =
  async ({ commit, state }, payload) => {

  const urlEndpoint = '/api/tech-spec/valid-ground-truthing-methods';

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  try {
    const response = await Vue.axios.get(urlEndpoint);
    const sclas = response.data;

    commit(mutTypes.SET_VALID_GROUND_TRUTHING_METHODS, sclas);
  } catch (error) {
    commit(mutTypes.SET_REQUEST_ERROR, error);
    console.log(error);
  }
}

export const getValidPositioningRequirements =
  async ({ commit, state }, payload) => {

  const urlEndpoint = '/api/tech-spec/valid-positioning-requirements';

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  try {
    const response = await Vue.axios.get(urlEndpoint);
    const sclas = response.data;

    commit(mutTypes.SET_VALID_POSITIONING_REQUIREMENTS, sclas);
  } catch (error) {
    commit(mutTypes.SET_REQUEST_ERROR, error);
    console.log(error);
  }
}
