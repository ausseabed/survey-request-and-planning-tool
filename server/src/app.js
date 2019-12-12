'use strict';
import express from 'express' //var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var api = require('./routes/api');
var users = require('./routes/users');
var auth = require('./routes/auth');

var cors = require('cors');

import "reflect-metadata";
import {createConnection} from "typeorm";


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

  var server = app.listen(app.get('port'), function () {
    console.log('Server listening on port ' + server.address().port);
  });
});
