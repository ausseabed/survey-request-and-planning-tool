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

export const getDeliverableList = async ({ commit, state }, payload) => {
  const urlEndpoint = `/api/deliverable/${payload.id}/list`;

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  try {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);

    const response = await Vue.axios.get(urlEndpoint);
    const deliverables = response.data;

    commit(mutTypes.SET_DELIVERABLE_LIST, deliverables);
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.SUCCESS);
  } catch (error) {
    commit(mutTypes.SET_REQUEST_ERROR, error);
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.ERROR);
    console.log(error);
  }
}

export const addDeliverablesToSurvey = async ({ commit, state }, payload) => {
  const urlEndpoint = `/api/deliverable/${payload.id}/list`;

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  try {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);

    const response = await Vue.axios.post(urlEndpoint, payload.deliverableList);
    const deliverables = response.data;

    const newList = [];
    newList.push(...deliverables);
    newList.push(...state.deliverableList);

    commit(mutTypes.SET_DELIVERABLE_LIST, newList);
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.SUCCESS);
  } catch (error) {
    commit(mutTypes.SET_REQUEST_ERROR, error);
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.ERROR);
    console.log(error);
  }

}


export const saveDeliverableList = async ({ commit, state }, payload) => {
  const urlEndpoint = `/api/deliverable/${payload.id}/list`;

  commit(mutTypes.SET_REQUEST_ERROR, undefined);

  try {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);

    const response = await Vue.axios.post(urlEndpoint, state.deliverableList);
    const dList = response.data;

    commit(mutTypes.SET_DELIVERABLE_LIST, dList);
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.SUCCESS);
  } catch (error) {
    commit(mutTypes.SET_REQUEST_ERROR, error);
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.ERROR);
    console.log(error);
  }
}

export const deleteDeliverable = async ({ commit, state }, payload) => {
  const urlEndpoint = `/api/deliverable/${payload.id}/`;

  commit(mutTypes.SET_REQUEST_ERROR, undefined);

  try {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);

    const response = await Vue.axios.delete(urlEndpoint);

    const newList = state.deliverableList.filter((d) => {
      return d.id != payload.id;
    });

    commit(mutTypes.SET_DELIVERABLE_LIST, newList);
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.SUCCESS);
  } catch (error) {
    commit(mutTypes.SET_REQUEST_ERROR, error);
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.ERROR);
    console.log(error);
  }
}
