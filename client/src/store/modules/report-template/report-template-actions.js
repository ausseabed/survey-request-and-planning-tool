import Vue from 'vue'
const FileDownload = require('js-file-download');

import * as mutTypes from './report-template-mutation-types'
import { RequestStatus } from '../request-status'


export const getReportTemplates = async ({ commit, state }) => {
  const urlEndpoint = `/api/report-template/`;

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  try {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);

    const response = await Vue.axios.get(urlEndpoint);
    let files = response.data;

    commit(mutTypes.UPDATE, {path: 'reportTemplates', value: files});
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.SUCCESS);
  } catch (error) {
    commit(mutTypes.SET_REQUEST_ERROR, error);
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.ERROR);
    console.log(error);
  }
}


export const deleteReportTemplate = async ({ commit, state }, payload) => {
  const urlEndpoint = `/api/report-template/${payload.id}`;

  commit(mutTypes.SET_REQUEST_ERROR, undefined);
  try {
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.REQUESTED);

    const response = await Vue.axios.delete(urlEndpoint);

    commit(mutTypes.REMOVE_REPORT_TEMPLATE, payload.id);
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.SUCCESS);
  } catch (error) {
    commit(mutTypes.SET_REQUEST_ERROR, error);
    commit(mutTypes.SET_REQUEST_STATUS, RequestStatus.ERROR);
    console.log(error);
  }
}

export const getReportTemplateTypes = ({ commit, state }) => {
  var url_endpoint = '/api/report-template/types';

  return Vue.axios.get(url_endpoint)
  .then((response) => {
    commit(mutTypes.UPDATE, {path: 'reportTemplateTypes', value:response.data});
  })
}
