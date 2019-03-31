import Vue from 'vue'

import * as mutTypes from './tech-spec-mutation-types'
import { RequestStatus } from '../request-status'

export const getTechSpec = async ({ commit, state }, payload) => {
  const urlEndpoint = '/api/tech-spec/' + payload.id;

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  try {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);

    const response = await Vue.axios.get(urlEndpoint);
    const techSpec = response.data;

    commit(mutTypes.UPDATE, {path: 'techSpec', value: techSpec});
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.SUCCESS);
    commit(mutTypes.SET_DIRTY, false);
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
    commit(mutTypes.SET_DIRTY, false);
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

export const getValidDeliveryMethods =
  async ({ commit, state }, payload) => {

  const urlEndpoint = '/api/tech-spec/valid-delivery-methods';

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  try {
    const response = await Vue.axios.get(urlEndpoint);
    const sclas = response.data;

    commit(mutTypes.SET_VALID_DELIVERY_METHODS, sclas);
  } catch (error) {
    commit(mutTypes.SET_REQUEST_ERROR, error);
    console.log(error);
  }
}

async function getReferenceSystem(commit, type, setMutatation) {
  const urlEndpoint = '/api/reference-system';
  const payload = {params: {type: type}};

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  try {
    const response = await Vue.axios.get(urlEndpoint, payload);
    const sclas = response.data;

    commit(setMutatation, sclas);
  } catch (error) {
    commit(mutTypes.SET_REQUEST_ERROR, error);
    console.log(error);
  }
}

export const getHorizontalReferenceSystems =
  async ({ commit, state }, payload) => {

  getReferenceSystem(
    commit, 'horizontal', mutTypes.SET_HORIZONTAL_REFERENCE_SYSTEMS);
}

export const getVerticalReferenceSystems =
  async ({ commit, state }, payload) => {

  getReferenceSystem(
    commit, 'vertical', mutTypes.SET_VERTICAL_REFERENCE_SYSTEMS);
}

export const getSoundingDatums = async ({ commit, state }, payload) => {
  getReferenceSystem(commit, 'sounding', mutTypes.SET_SOUNDING_DATUMS);
}

export const getSpheroids = async ({ commit, state }, payload) => {
  getReferenceSystem(commit, 'spheroid', mutTypes.SET_SPHEROIDS);
}
