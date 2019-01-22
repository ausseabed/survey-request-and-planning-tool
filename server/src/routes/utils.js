const boom = require('boom');

var auth = require('../lib/auth')();

import { multiPolygon, multiLineString } from "@turf/helpers";

export const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    if (!err.isBoom) {
      return next(boom.badImplementation(err));
    }
    err.statusCode = err.output.statusCode;
    next(err);
  });
};

// Raise 401 if user is not authenticated
export function isAuthenticated(req, res, next) {
    if (req.headers.authorization) {
        var verified_user = auth.verify(req.headers.authorization);
        if (verified_user) {
            req.user = verified_user;
            return next();
        }
    }

    // Send unauthrized response if we get here
    res.status(401).send('Unauthorized');
}

// Appends user to req is authenticated, will not 401
export function authenticatedUser(req, res, next) {
    if (req.headers.authorization) {
        var verified_user = auth.verify(req.headers.authorization);
        if (verified_user) {
            req.user = verified_user;
        }
    }

    return next();
}

export function geojsonToMultiPolygon(geojson) {
  //converts a geosjon object to a multipolygon geojson object
  if (typeof geojson === 'string' || geojson instanceof String) {
    //if it wasn't an object, parse it to one.
    geojson = JSON.parse(geojson);
  }

  if (geojson.type == 'MultiPolygon') {
    //already in suitable format
    return geojson;
  }

  if (geojson.type == 'FeatureCollection') {
    let polys = [];
    geojson.features.forEach(function(feature) {
      if (feature.type == 'Feature' &&
          feature.geometry.type == 'Polygon') {
        polys.push(feature.geometry.coordinates);

      } else if (feature.type == 'Feature' &&
                 feature.geometry.type == 'MultiPolygon') {
        polys.push(...feature.geometry.coordinates);
      }
    });
    let mp = multiPolygon(polys);
    return mp;
  } else {
    let err = boom.notImplemented(
      `Geojson type ${geojson.type} is not supported`);
    throw err;
  }
}

export function geojsonToMultiLineString(geojson) {
  //converts a geosjon object to a multipolygon geojson object
  if (typeof geojson === 'string' || geojson instanceof String) {
    //if it wasn't an object, parse it to one.
    geojson = JSON.parse(geojson);
  }

  if (geojson.type == 'MultiLineString') {
    //already in suitable format
    return geojson;
  }

  if (geojson.type == 'FeatureCollection') {
    let lines = [];
    geojson.features.forEach(function(feature) {
      if (feature.type == 'Feature' &&
          feature.geometry.type == 'LineString') {
        lines.push(feature.geometry.coordinates);

      } else if (feature.type == 'Feature' &&
                 feature.geometry.type == 'MultiLineString') {
        lines.push(...feature.geometry.coordinates);
      }
    });
    let mls = multiLineString(lines);
    return mls;
  } else {
    let err = boom.notImplemented(
      `Geojson type ${geojson.type} is not supported`);
    throw err;
  }
}

function sleep(ms){
  return new Promise(resolve=>{
    setTimeout(resolve,ms)
  })
}
