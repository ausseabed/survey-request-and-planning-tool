'use strict';
var express = require('express');
var auth = require('../lib/auth')();
var router = express.Router();
var logger = require('../lib/logger').logger;
var logIdGen = require('../lib/logger').logId;
var _ = require('lodash');
var uuid5 = require('uuid/v5');
var uuid4 = require('uuid/v4');
var AWS = require('aws-sdk');
var path = require('path');
var hash = require('object-hash');
var RouteError = require('./route-error');

import { isAuthenticated } from './utils';

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});

module.exports = router;
