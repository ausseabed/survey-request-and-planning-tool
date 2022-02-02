import _ from 'lodash';
import * as Boom from '@hapi/boom';
import express from 'express';
const url = require('url');

import { isAuthenticated } from '../utils';

const requestProxy = require("express-request-proxy");
const router = express.Router();

// proxy request handler to work around CORS restrictions that prevents the client
// from accessing WMS services directly.
// example request url:
//    http://localhost:3001/api/proxy/https://ows.services.dea.ga.gov.au/?service=WMS&version=1.3.0&request=GetCapabilities
// would fetch data from:
//    https://ows.services.dea.ga.gov.au/?service=WMS&version=1.3.0&request=GetCapabilities
router.get(
  '/*',
  [isAuthenticated],
  (req, res, next) => {

    const endIndex = req.originalUrl.indexOf('/proxy/') + 7;
    if (endIndex == req.originalUrl.length) {
      let err = Boom.notFound("No target url provided");
      throw err;
    }
    const targetUrl = req.originalUrl.substring(endIndex);

    var parsedUrl = url.parse(targetUrl, true);
    var queryData = parsedUrl.query;
    var targetHostAndPath = parsedUrl.protocol + '//' + parsedUrl.host + '/' + parsedUrl.pathname;

    return requestProxy({ url: targetHostAndPath, queryData: queryData })(req, res, next);
  });


module.exports = router;
