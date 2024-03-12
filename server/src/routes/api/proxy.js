import _ from 'lodash';
import * as Boom from '@hapi/boom';
const url = require('url');

var proxy = require('express-http-proxy');

// proxy request handler to work around CORS restrictions that prevents the client
// from accessing WMS services directly.
// example request url:
//    http://localhost:3001/api/proxy/https://ows.services.dea.ga.gov.au/?service=WMS&version=1.3.0&request=GetCapabilities
// would fetch data from:
//    https://ows.services.dea.ga.gov.au/?service=WMS&version=1.3.0&request=GetCapabilities

const getTargetUrl = (srcUrl) => {
  const endIndex = srcUrl.indexOf('/proxy/') + 7;
  if (endIndex == srcUrl.length) {
    let err = Boom.notFound("No target url provided");
    throw err;
  }
  const targetUrl = srcUrl.substring(endIndex);
  return targetUrl;
};

const sctProxy = proxy(
  function (req) {
    const targetUrl = getTargetUrl(req.originalUrl);
    var parsedUrl = url.parse(targetUrl, true);
    var targetHost = parsedUrl.protocol + '//' + parsedUrl.host;
    return targetHost;
  },
  {
    proxyReqPathResolver: function (req) {
      const targetUrl = getTargetUrl(req.originalUrl);
      var parsedUrl = url.parse(targetUrl, false);
      return parsedUrl.pathname + '?' + parsedUrl.query;
    }
  }
)

module.exports = sctProxy;
