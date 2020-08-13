const _ = require('lodash');
import * as Boom from '@hapi/boom';
import { getConnection } from 'typeorm';

var auth = require('../lib/auth')();
import { User } from '../lib/entity/user';

import { multiPolygon, multiLineString, multiPoint } from "@turf/helpers";
import truncate from "@turf/truncate";

export const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    if (!err.isBoom) {
      return next(Boom.badImplementation(err));
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
        relations: ['role', 'custodian']
      }
    );
    if (_.isNil(existingUser)) {
      res.status(401).send('Unauthorized');
      return
    }

    existingUser.lastSeen = Date.now();
    await getConnection()
    .getRepository(User)
    .save(existingUser)

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


// Following middleware takes an object as follows
// {
//   entityType: SurveyRequest,
//   entityTypeFn: getetypes,
//   custodianAttributes: ['custodians'],
//   custodianAttributesFn: getcustodianattrs,
//   allowedPermissionAll: 'cangetallprojs',
//   allowedPermissionAllFn: getcangetallprojs,
//   allowedPermissionCustodian: 'cangetcustodianprojs',
//   allowedPermissionCustodianFn: getcangetcustodianprojs,
//   allowedPermissionNoEntityId: 'canaddproj',
// }


// middleware for doing role-based permissions
export function permitCustodianBasedPermission(params) {
  const allowedPermissionNoEntityId = params.allowedPermissionNoEntityId

  // this is the name of an entity attribute that allows permission checks
  // to be skipped if the flag attribute is true. This is used for the `public`
  // attribute allowing all users to view plans/requests that have been marked
  // as public by a user.
  const overrideFlag = params.overrideFlag

  // eg; if trying to add a new entity (instead of editing existing)
  const isAllowedNoEntityId = role => {
    if (_.isNil(allowedPermissionNoEntityId)) {
      return false
    }
    return hasPermission(role, allowedPermissionNoEntityId)
  };

  const isAllowed = (user, custodianlist, allowedPermissionAll, allowedPermissionCustodian) => {
    const role = user.role;
    if (hasPermission(role, allowedPermissionAll)) {
      // user has the permission that lets them view all of this role
      return true
    } else if (
      !_.isNil(user.custodian) &&
      hasPermission(role, allowedPermissionCustodian))
    {
      // user has the permission that only lets them view this entity if the
      // entity is linked to their custodian
      const matchingCustodian = custodianlist.find((innCustodian) => {
        return innCustodian.id === user.custodian.id;
      })
      // if a matchin custodian is found, then the user can view this entity
      return !_.isNil(matchingCustodian)
    } else {
      return false
    }
  };


  return async (request, response, next) => {
    const allCustodians = []

    let eid = request.params.id ? request.params.id : request.body.id
    if (_.isNil(eid)) {
      if (request.user && isAllowedNoEntityId(request.user.role))
        next();
      else {
        response.status(403).json({message: "Forbidden"});
      }
    } else {
      // In some cases we know up front what the entity type and custodian attrs
      // are. In other cases we will only know when the request comes in
      // (eg; attachments which may link to projects or hipp requests); for
      // this reason we allow a function to be passed in.
      let entityType = undefined;
      if (!_.isNil(params.entityType)) {
        entityType = params.entityType;
      } else if (!_.isNil(params.entityTypeFn)) {
        entityType = params.entityTypeFn(request);
      } else  {
        throw new Error("Must provide either entityType or entityTypeFn");
      }
      let custodianAttributes = undefined;
      if (!_.isNil(params.custodianAttributes)) {
        custodianAttributes = params.custodianAttributes;
      } else if (!_.isNil(params.custodianAttributesFn)) {
        custodianAttributes = params.custodianAttributesFn(request);
      } else {
        throw new Error("Must provide either custodianAttributes or " +
          "custodianAttributesFn");
      }

      let allowedPermissionAll = params.allowedPermissionAll
      if (_.isNil(allowedPermissionAll) && !_.isNil(params.allowedPermissionAllFn)) {
        allowedPermissionAll = params.allowedPermissionAllFn(request)
      }
      if (_.isNil(allowedPermissionAll)) {
        throw new Error("Must provide either allowedPermissionAll or " +
          "allowedPermissionAllFn");
      }
      let allowedPermissionCustodian = params.allowedPermissionCustodian
      if (_.isNil(allowedPermissionCustodian) && !_.isNil(params.allowedPermissionCustodianFn)) {
        allowedPermissionCustodian = params.allowedPermissionCustodianFn(request)
      }
      if (_.isNil(allowedPermissionCustodian)) {
        throw new Error("Must provide either allowedPermissionCustodian or " +
          "allowedPermissionCustodianFn");
      }

      const selectAttrs = _.isNil(overrideFlag) ? ['id'] : ['id', overrideFlag]

      // get the entity, but only the id attribute and the attributes that link
      // to one or more custodians
      let entity = await getConnection()
      .getRepository(entityType)
      .findOne(
        eid,
        {
          select: selectAttrs,
          relations: custodianAttributes
        }
      );

      if (_.isNil(entity)) {
        response.status(404).json({message: "Entity not found for permission check"});
        return
      }

      if (!_.isNil(overrideFlag) && entity[overrideFlag]) {
        next();
        return
      }

      // aggregate the various list of custodians associated with this
      // entity into the one array
      for (let custodiansAttrName of custodianAttributes) {
        let custodians = entity[custodiansAttrName];
        if (!_.isNil(custodians)) {
          // most of the time custodians is a list, but for priority area
          // submissions there is only one custodian. So we check...
          if (Array.isArray(custodians)) {
            allCustodians.push(...custodians);
          } else {
            allCustodians.push(custodians);
          }

        }
      }

      if (
        request.user &&
        isAllowed(request.user, allCustodians, allowedPermissionAll, allowedPermissionCustodian))
      {
        next(); // role is allowed, so continue on the next middleware
      } else {
        response.status(403).json({message: "Forbidden"});
      }
    }
  }
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
    // use truncate to remove the z coordinate (if it exists)
    mp = truncate(mp, {
      coordinates: 2
    })
    return mp.geometry;
  } else {
    let err = Boom.notImplemented(
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
    let err = Boom.notImplemented(
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
    let err = Boom.notImplemented(
      `Geojson type ${geojson.type} is not supported`);
    throw err;
  }
}

export function sleep(ms){
  return new Promise(resolve=>{
    setTimeout(resolve,ms)
  })
}
