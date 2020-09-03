import Vue from 'vue';
import Vuex from 'vuex';

import auth from './modules/auth/auth-state';
import custodian from './modules/custodian/custodian-state';
import dataCaptureType from './modules/data-capture-type/data-capture-type-state';
import deliverable from './modules/deliverable/deliverable-state';
import document from './modules/document/document-state';
import instrumentType from './modules/instrument-type/instrument-type-state';
import organisation from './modules/organisation/organisation-state';
import priorityAreaSubmission from './modules/priority-area-submission/priority-area-submission-state';
import recordState from './modules/record-state/record-state-state';
import reportTemplate from './modules/report-template/report-template-state';
import requestPurpose from './modules/request-purpose/request-purpose-state';
import role from './modules/role/role-state';
import surveyApplication from './modules/survey-application/survey-application-state';
import surveyFile from './modules/survey-file/survey-file-state';
import surveyPlan from './modules/survey-plan/survey-plan-state';
import surveyRequest from './modules/survey-request/survey-request-state';
import techSpec from './modules/tech-spec/tech-spec-state';
import user from './modules/user/user-state';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    auth,
    custodian,
    dataCaptureType,
    deliverable,
    document,
    instrumentType,
    organisation,
    priorityAreaSubmission,
    recordState,
    reportTemplate,
    requestPurpose,
    role,
    surveyApplication,
    surveyFile,
    surveyPlan,
    surveyRequest,
    techSpec,
    user,
  },
  strict: debug
});
