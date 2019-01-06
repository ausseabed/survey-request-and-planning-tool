var express = require('express');
var projectMetadataRoutes = require('./api/project-metadata');
var auth = require('./auth');

import { isAuthenticated } from './utils';

var router = express.Router();
router
.use('/auth', auth)
.use('/project-metadata', projectMetadataRoutes)


module.exports = router;
