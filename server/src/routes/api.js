var express = require('express');

var attachmentRoutes = require('./api/attachment');
var auth = require('./auth');
var checkAoi = require('./api/check-aoi');
var custodianRoutes = require('./api/custodian');
var dataCaptureTypeRoutes = require('./api/data-capture-type');
var deliverableRoutes = require('./api/deliverable');
var instrumentTypeRoutes = require('./api/instrument-type');
var organisationRoutes = require('./api/organisation');
var recordStateRoutes = require('./api/record-state');
var referenceSystemRoutes = require('./api/reference-system');
var reportTemplateRoutes = require('./api/report-template');
var requestPurposeRoutes = require('./api/request-purpose');
var roleRoutes = require('./api/role');
var surveyApplicationRoutes = require('./api/survey-application');
var surveyPlanRoutes = require('./api/survey-plan');
var surveyRequestRoutes = require('./api/survey-request');
var techSpecRoutes = require('./api/tech-spec');
var userRoutes = require('./api/user');

import { isAuthenticated } from './utils';

var router = express.Router();
router
.use('/attachment', attachmentRoutes)
.use('/auth', auth)
.use('/check-aoi', checkAoi)
.use('/custodian', custodianRoutes)
.use('/data-capture-type', dataCaptureTypeRoutes)
.use('/deliverable', deliverableRoutes)
.use('/instrument-type', instrumentTypeRoutes)
.use('/organisation', organisationRoutes)
.use('/record-state', recordStateRoutes)
.use('/reference-system', referenceSystemRoutes)
.use('/report-template', reportTemplateRoutes)
.use('/request-purpose', requestPurposeRoutes)
.use('/role', roleRoutes)
.use('/survey-application', surveyApplicationRoutes)
.use('/survey-plan', surveyPlanRoutes)
.use('/survey-request', surveyRequestRoutes)
.use('/tech-spec', techSpecRoutes)
.use('/user', userRoutes)

module.exports = router;
