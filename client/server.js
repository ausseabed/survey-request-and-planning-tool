// Serve up vue as static

var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');
var history = require('connect-history-api-fallback');

app = express();

app
  .use(history())
  .use(serveStatic(__dirname + "/dist/spa-mat"));

var port = process.env.PORT || 3001;

app.listen(port);

console.log('server started ' + port);
