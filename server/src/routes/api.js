var express = require('express');
var checkAoi = require('./api/check-aoi');
var projectMetadataRoutes = require('./api/project-metadata');
var auth = require('./auth');

import { isAuthenticated } from './utils';

var router = express.Router();
router
.use('/auth', auth)
.use('/check-aoi', checkAoi)
.use('/project-metadata', projectMetadataRoutes)


module.exports = router;
