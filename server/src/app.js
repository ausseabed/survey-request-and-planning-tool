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

import {ProjectMetadata} from './lib/entity/project-metadata';

var app = express();

app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api', api);
app.use('/users', users);
// app.use('/auth', auth);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function (err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// production error handler
// no stacktraces leaked to user
// app.use(function (err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });

app.set('port', process.env.PORT || 3000);

createConnection().then(connection => {
  let connOpts = connection.options;
  console.log(`Connected to database ${connOpts.host}:${connOpts.port} ` +
    `(${connOpts.type})`);
  var server = app.listen(app.get('port'), function () {
    console.log('Server listening on port ' + server.address().port);
  });
});


//
// var server = app.listen(app.get('port'), function () {
//     debug('Express server listening on port ' + server.address().port);
//
//     // TODO - remove this test code
//     createConnection().then(async connection => {
//       const projdata = new ProjectMetadata();
//       projdata.surveyName = "My project";
//
//       let projRepository = connection.getRepository(ProjectMetadata);
//       await projRepository.save(projdata);
//       console.log("project metadata has been saved: ", projdata);
//       let savedPhotos = await projRepository.find();
//       console.log("saved photos");
//       console.log(savedPhotos);
//       //
//       // return connection.manager
//       //   .save(projdata)
//       //   .then(pm => {
//       //       console.log("project metadata has been saved: ", pm);
//       //   });
//     });
//
//     // // Configure AWS on startup
//     // // server ready to accept connections here
//     // if (process.env.NODE_ENV === 'development') {
//     //     // We need credentials & parameters only for development environment.
//     //     // Staging & test will derive their creds from EC2 instance
//     //     var params = {
//     //         region: process.env.AWS_DEFAULT_REGION,
//     //         accessKeyId: process.env.AWS_ACCESS_KEY,
//     //         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
//     //     }
//     //     AWS.config.update(params);
//     // }
//     // AWS.config.setPromisesDependency(require('bluebird'));
// });
