import Vue from 'vue'
const FileDownload = require('js-file-download');

import * as mutTypes from './document-mutation-types'
import { RequestStatus } from '../request-status'


export const getDocuments = async ({ commit, state }) => {
  const urlEndpoint = `/api/document/`;

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  try {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);

    const response = await Vue.axios.get(urlEndpoint);
    let files = response.data;

    commit(mutTypes.UPDATE, {path: 'documents', value: files});
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.SUCCESS);
  } catch (error) {
    commit(mutTypes.SET_REQUEST_ERROR, error);
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.ERROR);
    console.log(error);
  }
}


export const deleteDocument = async ({ commit, state }, payload) => {
  const urlEndpoint = `/api/document/${payload.id}`;

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  try {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);

    const response = await Vue.axios.delete(urlEndpoint);

    commit(mutTypes.REMOVE_DOCUMENT, payload.id);
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.SUCCESS);
  } catch (error) {
    commit(mutTypes.SET_REQUEST_ERROR, error);
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.ERROR);
    console.log(error);
  }
}


export const getDocumentTypes = ({ commit, state }) => {
  var url_endpoint = '/api/document/types';

  return Vue.axios.get(url_endpoint)
  .then((response) => {
    commit(mutTypes.UPDATE, {path: 'documentTypes', value:response.data});
  })
}
