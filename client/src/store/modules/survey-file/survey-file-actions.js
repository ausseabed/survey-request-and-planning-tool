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
    let files = response.data;
    files.forEach((f) => {
      f.progress = 0;
      f.downloading = false;
    });

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

  commit(
    mutTypes.SET_FILE_DOWNLOADING,
    {fileId: payload.id, downloading: true}
  );

  const getParams = {
    responseType: 'arraybuffer',
    onDownloadProgress: (progressEvent) => {
      let percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total);
      console.log(progressEvent.lengthComputable);
      console.log(percentCompleted);

      commit(
        mutTypes.SET_FILE_PROGRESS,
        {fileId: payload.id, progress: percentCompleted}
      );
    }
  }

  Vue.axios.get(urlEndpoint, getParams)
  .then((response) => {
    FileDownload(response.data, payload.name);
    commit(
      mutTypes.SET_FILE_PROGRESS,
      {fileId: payload.id, progress: 0}
    );
    commit(
      mutTypes.SET_FILE_DOWNLOADING,
      {fileId: payload.id, downloading: false}
    );
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
