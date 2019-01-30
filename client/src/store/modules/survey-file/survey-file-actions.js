import Vue from 'vue'
const FileDownload = require('js-file-download');

import * as mutTypes from './survey-file-mutation-types'
import { RequestStatus } from '../request-status'


export const getFiles = async ({ commit, state }) => {
  const urlEndpoint = `/api/survey-file/${state.id}`;

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  try {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);

    const response = await Vue.axios.get(urlEndpoint);
    const files = response.data;

    commit(mutTypes.UPDATE, {path: 'files', value: files});
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.SUCCESS);
  } catch (error) {
    commit(mutTypes.SET_REQUEST_ERROR, error);
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.ERROR);
    console.log(error);
  }
}

export const downloadFile = async ({commit, state}, payload) => {
  const urlEndpoint =
    `/api/survey-file/${state.id}/download/${payload.id}`;
  const getParams = { responseType: 'arraybuffer' }

  Vue.axios.get(urlEndpoint, getParams)
  .then((response) => {
    FileDownload(response.data, payload.name);
  });
}

export const deleteFile = async ({ commit, state }, payload) => {
  const urlEndpoint =
    `/api/survey-file/${state.id}/delete/${payload.id}`;

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  try {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);

    const response = await Vue.axios.delete(urlEndpoint);

    commit(mutTypes.REMOVE_FILE, payload.id);
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.SUCCESS);
  } catch (error) {
    commit(mutTypes.SET_REQUEST_ERROR, error);
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.ERROR);
    console.log(error);
  }
}
