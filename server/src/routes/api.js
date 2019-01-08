var express = require('express');

var auth = require('./auth');
var checkAoi = require('./api/check-aoi');
var projectMetadataRoutes = require('./api/project-metadata');
var organisationRoutes = require('./api/organisation');

import { isAuthenticated } from './utils';

var router = express.Router();
router
.use('/auth', auth)
.use('/check-aoi', checkAoi)
.use('/project-metadata', projectMetadataRoutes)
.use('/organisation', organisationRoutes)


module.exports = router;
