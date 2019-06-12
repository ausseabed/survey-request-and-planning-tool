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

import { interpret } from 'xstate';
import { requestRecordMachine } from './routes/state-management';

// const machine = requestRecordMachine;
const service = interpret(requestRecordMachine).onTransition(state => {
  console.log(state.value);
});

service.start();
service.send('SAVE');
service.send('FINALIZE');
service.send('SAVE');
// service.send('FINALIZE');
service.send('ACCEPT');

service.stop();

// const runActions = (recordState, evtObj) => {
//   recordState.actions.forEach((action) => {
//     console.log(action)
//     action.exec(evtObj)
//   });
// };
//
// const { initialState } = requestRecordMachine;
// console.log(initialState.value);
// runActions(initialState);
//
// let nextState = requestRecordMachine.transition(initialState, 'SAVE');
// console.log(nextState.actions);
// runActions(nextState);
//
// nextState = requestRecordMachine.transition(nextState, 'FINALIZE');
// console.log(nextState.value);
// runActions(nextState);
//
// nextState = requestRecordMachine.transition(nextState, 'SAVE');
// console.log(nextState.value);
// runActions(nextState);
//
// nextState = requestRecordMachine.transition(nextState, 'SAVE');
// console.log(nextState.value);
// runActions(nextState);
//
// nextState = requestRecordMachine.transition(nextState, 'FINALIZE');
// console.log(nextState.value);
// runActions(nextState);



var app = express();

// Set no cache headers to ensure browsers (especially IE)
// don't cache the API requests
// All requests made to node are api requests. Some could be cached, but it's
// probably better this way.
app.use((req, res, next) => {
    res.setHeader('Expires', '-1');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

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
