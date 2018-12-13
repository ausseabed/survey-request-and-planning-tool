const http = require('http');

const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World 4\n');
});

server.listen(port, () => {
  console.log(`Server running at http://hhh:${port}/`);
});


// ﻿'use strict';
// var debug = require('debug');
// var express = require('express');
// var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
// var AWS = require('aws-sdk');
//
// var routes = require('./routes/index');
// var users = require('./routes/users');
// var auth = require('./routes/auth');
//
// var cors = require('cors');
//
// var app = express();
// app.use(cors())
//
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');
//
// // uncomment after placing your favicon in /public
// //app.use(favicon(__dirname + '/public/favicon.ico'));
// app.use(logger('dev'));
// app.use(bodyParser.json({ limit: '5mb' }));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
//
// app.use('/', routes);
// app.use('/users', users);
// app.use('/auth', auth);
//
// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });
//
// // error handlers
//
// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//     app.use(function (err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: err
//         });
//     });
// }
//
// // production error handler
// // no stacktraces leaked to user
// app.use(function (err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });
//
// app.set('port', process.env.PORT || 3000);
//
// debug('testing');
//
// var server = app.listen(app.get('port'), function () {
//     debug('Express server listening on port ' + server.address().port);
//
//     // Configure AWS on startup
//     // server ready to accept connections here
//     if (process.env.NODE_ENV === 'development') {
//         // We need credentials & parameters only for development environment.
//         // Staging & test will derive their creds from EC2 instance
//         params = {
//             region: process.env.AWS_DEFAULT_REGION,
//             accessKeyId: process.env.AWS_ACCESS_KEY,
//             secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
//         }
//         AWS.config.update(params);
//     }
//     AWS.config.setPromisesDependency(require('bluebird'));
// });
