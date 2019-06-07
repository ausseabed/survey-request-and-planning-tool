'use strict';
var debug = require('debug');
import express from 'express' //var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var AWS = require('aws-sdk');

var routes = require('./routes/index');
var api = require('./routes/api');
var users = require('./routes/users');
var auth = require('./routes/auth');

var cors = require('cors');

import "reflect-metadata";
import {createConnection} from "typeorm";

var app = express();

app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api', api);
app.use('/users', users);


app.set('port', process.env.PORT || 3000);

createConnection().then(connection => {
  let connOpts = connection.options;
  console.log(`Connected to database ${connOpts.host}:${connOpts.port} ` +
    `(${connOpts.type})`);

  if (!process.env.AWS_REGION ||
      !process.env.AWS_ACCESS_KEY_ID ||
      !process.env.AWS_SECRET_ACCESS_KEY) {
    console.log("AWS related environment variables not set");
  }
  AWS.config.setPromisesDependency(require('bluebird'));

  var server = app.listen(app.get('port'), function () {
    console.log('Server listening on port ' + server.address().port);
  });
});
