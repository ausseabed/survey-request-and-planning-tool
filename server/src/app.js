'use strict';
import express from 'express' //var express = require('express');
const nocache = require('nocache');
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

import { PostgresDriver } from 'typeorm/driver/postgres/PostgresDriver';
import { PostgresQueryRunner } from 'typeorm/driver/postgres/PostgresQueryRunner';
import { EventEmitter } from 'events';

var app = express();

// Set no cache headers to ensure browsers (especially IE)
// don't cache the API requests
// All requests made to node are api requests. Some could be cached, but it's
// probably better this way.
app.use(nocache());

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



class ErrorHandlingPostgresQueryRunner extends PostgresQueryRunner {
  constructor(driver, mode) {
    super(driver, mode);
  }

  query(query, parameters) {
    return super.query(query, parameters).catch(err => {
      if (this.releaseCallback) {
        const originalReleaseCallback = this.releaseCallback;
        this.releaseCallback = () => {
          originalReleaseCallback(err); // pass the error back to 'pg' connection
        };
      }
      throw err;
    });
  }
}

function errorHandler(err) {
  console.log(`Error on postgres connection: ${err.message}`);
}
const addErrorHandler = (client) => client.on('error', errorHandler);
const removeErrorHandler = (client) => client.removeListener('error', errorHandler);

export function configureErrorHandling(driver) {
  const connectionPool = driver.master;
  // Add error handlers to all new database connections
  connectionPool.on('connect', addErrorHandler);
  connectionPool.on('remove', removeErrorHandler);
  // TypeORM creates a connection on startup to verify connection parameters. Add an error handler to that too.
  // eslint-disable-next-line no-underscore-dangle
  connectionPool._clients.forEach(addErrorHandler);

  /* When a connection is killed during db failover, it starts throwing errors for all consecutive queries.
   * TypeORM doesn't pass those errors back to underlying connection pool, which is in general the right thing
   * to do. But in this case, the connection remains broken indefinitely.
   *
   * Monkey-patch the TypeORM query runner to pass any connection-level errors back to the pool.
   * This has the unfortunate side effect of closing the connection when a technical error occurs during query
   * (eg typo in query, duplicate unique value etc), but that is deemed a smaller evil compared to breaking down
   * during maintenance fail-overs.
   */
  // eslint-disable-next-line no-param-reassign
  driver.createQueryRunner = mode => {
    return new ErrorHandlingPostgresQueryRunner(driver, mode);
  };
}





createConnection().then(connection => {
  configureErrorHandling(connection.driver);

  let connOpts = connection.options;
  console.log(`Connected to database ${connOpts.host}:${connOpts.port} ` +
    `(${connOpts.type})`);

  var server = app.listen(app.get('port'), function () {
    console.log('Server listening on port ' + server.address().port);
  });
});
