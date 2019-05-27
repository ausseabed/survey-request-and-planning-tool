const _ = require('lodash');
const boom = require('boom');
import { getConnection } from 'typeorm';

var auth = require('../lib/auth')();
import { User } from '../lib/entity/user';

import { multiPolygon, multiLineString, multiPoint } from "@turf/helpers";

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
export const isAuthenticated = async (req, res, next) => {
  // requests coming from Axois use a header, other (eg from img src)
  // requests use a cookie
  const authToken =
    req.headers.authorization ?
      req.headers.authorization :
      req.cookies.Authorization

  if (_.isNil(authToken)) {
    res.status(401).send('Unauthorized');
    return
  }

  try {
    var verified_user = auth.verify(authToken);

    const userId = verified_user.id
    const existingUser = await getConnection().getRepository(User)
    .findOne(
      userId,
      {
        relations: ['role', 'organisation']
      }
    );
    if (_.isNil(existingUser)) {
      res.status(401).send('Unauthorized');
      return
    }

    req.user = existingUser;

    if (req.headers.authorization && _.isNil(req.cookies.Authorization)) {
      // then the header has a valid auth token, but it hasn't been set in
      // the cookie. New logins will have the cookie set, but existing
      // users wont (so do it here).
      // Todo; this could probably be removed in future one everyone's old
      // auth tokens have expired
      res.setHeader(
        'Set-Cookie', `Authorization=${req.headers.authorization} ; Path=/`);
    }

    return next();
  } catch(err) {
    res.status(401).send('Unauthorized');
  }
};

export const hasPermission = (role, permission) => {
  if (_.isNil(role)) {
    return false;
  } else if (role.hasOwnProperty(permission)) {
    return role[permission];
  } else {
    console.log(`permission ${permission} does not exist?`)
    return false;
  }
}

// middleware for doing role-based permissions
export function permitPermission(allowedPermission) {
  const isAllowed = role => {
    return hasPermission(role, allowedPermission)
  };

  // return a middleware
  return (request, response, next) => {
    if (request.user && isAllowed(request.user.role))
      next(); // role is allowed, so continue on the next middleware
    else {
      response.status(403).json({message: "Forbidden"}); // user is forbidden
    }
  }
}

// middleware for doing role-based permissions
export function permitOrgBasedPermission(
  entityType,
  organisationAttributes,
  allowedPermissionAll,
  allowedPermissionOrg,
  allowedPermissionNoEntityId = undefined) {

  // eg; if trying to add a new entity (instead of editing existing)
  const isAllowedNoEntityId = role => {
    if (_.isNil(allowedPermissionNoEntityId)) {
      return false
    }
    return hasPermission(role, allowedPermissionNoEntityId)
  };

  const isAllowed = (user, orglist) => {
    const role = user.role;
    if (hasPermission(role, allowedPermissionAll)) {
      // user has the permission that lets them view all of this role
      return true
    } else if (
      !_.isNil(user.organisation) &&
      hasPermission(role, allowedPermissionOrg))
    {
      // user has the permission that only lets them view this entity if the
      // entity is linked to their organisation
      const matchingOrg = orglist.find((innOrg) => {
        return innOrg.id === user.organisation.id;
      })
      // if a matchin org is found, then the user can view this entity
      return !_.isNil(matchingOrg)
    } else {
      return false
    }
  };


  return async (request, response, next) => {
    const allOrgs = []

    let eid = request.params.id ? request.params.id : request.body.id
    if (_.isNil(eid)) {
      if (request.user && isAllowedNoEntityId(request.user.role))
        next();
      else {
        response.status(403).json({message: "Forbidden"});
      }
    } else {
      // get the entity, but only the id attribute and the attributes that link
      // to one or more organisations
      let entity = await getConnection()
      .getRepository(entityType)
      .findOne(
        eid,
        {
          select: ['id'],
          relations: organisationAttributes
        }
      );

      // aggregate the various list of organisations associated with this
      // entity into the one array
      for (let orgsAttrName of organisationAttributes) {
        let orgs = entity[orgsAttrName]
        if (!_.isNil(orgs)) {
          allOrgs.push(...orgs)
        }
      }

      if (request.user && isAllowed(request.user, allOrgs))
        next(); // role is allowed, so continue on the next middleware
      else {
        response.status(403).json({message: "Forbidden"});
      }
    }
  }
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

export function isUuid(testString) {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(testString);
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
    return mp.geometry;
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
    return mls.geometry;
  } else {
    let err = boom.notImplemented(
      `Geojson type ${geojson.type} is not supported`);
    throw err;
  }
}

export function geojsonToMultiPoint(geojson) {
  //converts a geosjon object to a multipolygon geojson object
  if (typeof geojson === 'string' || geojson instanceof String) {
    //if it wasn't an object, parse it to one.
    geojson = JSON.parse(geojson);
  }

  if (geojson.type == 'MultiPoint') {
    //already in suitable format
    return geojson;
  }

  if (geojson.type == 'FeatureCollection') {
    let points = [];
    geojson.features.forEach(function(feature) {
      if (feature.type == 'Feature' &&
          feature.geometry.type == 'Point') {
        points.push(feature.geometry.coordinates);

      } else if (feature.type == 'Feature' &&
                 feature.geometry.type == 'MultiPoint') {
        points.push(...feature.geometry.coordinates);
      }
    });
    let mls = multiPoint(points);
    return mls.geometry;
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
