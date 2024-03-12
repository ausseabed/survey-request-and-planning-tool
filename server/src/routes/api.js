var express = require('express');

var attachmentRoutes = require('./api/attachment');
var auth = require('./auth');
var checkAoi = require('./api/check-aoi');
var custodianRoutes = require('./api/custodian');
var dataCaptureTypeRoutes = require('./api/data-capture-type');
var deliverableRoutes = require('./api/deliverable');
var documentRoutes = require('./api/document');
var instrumentTypeRoutes = require('./api/instrument-type');
var marineParkRoutes = require('./api/marine-park');
var organisationRoutes = require('./api/organisation');
var priorityAreaRoutes = require('./api/priority-area');
var priorityAreaSubmissionRoutes = require('./api/priority-area-submission');
var sctProxy = require('./api/proxy');
var recordStateRoutes = require('./api/record-state');
var referenceSystemRoutes = require('./api/reference-system');
var reportTemplateRoutes = require('./api/report-template');
var requestPurposeRoutes = require('./api/request-purpose');
var roleRoutes = require('./api/role');
var statusRoutes = require('./api/status');
var surveyApplicationRoutes = require('./api/survey-application');
var surveyPlanRoutes = require('./api/survey-plan');
var surveyRequestRoutes = require('./api/survey-request');
var surveyRequestAoiRoutes = require('./api/survey-request-aoi');
var taskRoutes = require('./api/task');
var techSpecRoutes = require('./api/tech-spec');
var userRoutes = require('./api/user');
var utilRoutes = require('./api/util');

import { isAuthenticated } from './utils';

var router = express.Router();
router
    .use('/attachment', attachmentRoutes)
    .use('/auth', auth)
    .use('/check-aoi', checkAoi)
    .use('/custodian', custodianRoutes)
    .use('/data-capture-type', dataCaptureTypeRoutes)
    .use('/deliverable', deliverableRoutes)
    .use('/document', documentRoutes)
    .use('/instrument-type', instrumentTypeRoutes)
    .use('/organisation', organisationRoutes)
    .use('/marine-park', marineParkRoutes)
    .use('/priority-area', priorityAreaRoutes)
    .use('/priority-area-submission', priorityAreaSubmissionRoutes)
    .use('/proxy', isAuthenticated, sctProxy)
    .use('/record-state', recordStateRoutes)
    .use('/reference-system', referenceSystemRoutes)
    .use('/report-template', reportTemplateRoutes)
    .use('/request-purpose', requestPurposeRoutes)
    .use('/role', roleRoutes)
    .use('/status', statusRoutes)
    .use('/survey-application', surveyApplicationRoutes)
    .use('/survey-plan', surveyPlanRoutes)
    .use('/survey-request', surveyRequestRoutes)
    .use('/survey-request-aoi', surveyRequestAoiRoutes)
    .use('/task', taskRoutes)
    .use('/tech-spec', techSpecRoutes)
    .use('/user', userRoutes)
    .use('/util', utilRoutes)

module.exports = router;
