var express = require('express');

var auth = require('./auth');
var checkAoi = require('./api/check-aoi');
var dataCaptureTypeRoutes = require('./api/data-capture-type');
var instrumentTypeRoutes = require('./api/instrument-type');
var projectMetadataRoutes = require('./api/project-metadata');
var organisationRoutes = require('./api/organisation');
var surveyApplicationRoutes = require('./api/survey-application');
var techSpecRoutes = require('./api/tech-spec');
var referenceSystemRoutes = require('./api/reference-system');

import { isAuthenticated } from './utils';

var router = express.Router();
router
.use('/auth', auth)
.use('/check-aoi', checkAoi)
.use('/data-capture-type', dataCaptureTypeRoutes)
.use('/instrument-type', instrumentTypeRoutes)
.use('/project-metadata', projectMetadataRoutes)
.use('/organisation', organisationRoutes)
.use('/survey-application', surveyApplicationRoutes)
.use('/tech-spec', techSpecRoutes)
.use('/reference-system', referenceSystemRoutes)


module.exports = router;
