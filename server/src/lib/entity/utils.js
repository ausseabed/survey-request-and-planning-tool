import _ from 'lodash';
import truncate from "@turf/truncate";
import { multiPolygon, multiLineString, multiPoint } from "@turf/helpers";

export class DateTransformer {
  to(value) {
    if (_.isNil(value)) {
      return undefined
    }
    const date = new Date();
    date.setTime(value);
    return date;
  }

  from(value) {
    if (_.isNil(value)) {
      return undefined;
    }
    return value.getTime();
  }
}

export function getParameterCaseInsensitive(object, key) {
  return object[Object.keys(object)
    .find(k => k.toLowerCase() === key.toLowerCase())
  ];
}

export function geojsonToFeatureList(geojson) {
  // converts the geojson into a list of features. The geometry type of
  // all these features is multipolygon.

  if (geojson.type == 'MultiPolygon') {
    //already in suitable format
    return geojson;
  }

  if (geojson.type == 'Feature') {
    if (geojson.geometry.type == 'MultiPolygon') {
      // then it's ok
      return [geojson];
    } else if (geojson.geometry.type == 'Polygon') {
      // then convert the polygon into a multipolygon
      let polys = [];
      polys.push(geojson.geometry.coordinates);
      let mp = multiPolygon(polys);
      // use truncate to remove the z coordinate (if it exists)
      mp = truncate(mp, {
        coordinates: 2
      });
      geojson.geometry = mp.geometry;
      return [geojson];
    } else {
      return [];
    }

  } else if (geojson.type == 'FeatureCollection') {
    let features = [];
    geojson.features.forEach(function (feature) {
      features.push(...geojsonToFeatureList(feature));
    });
    return features;

  } else {
    let err = Boom.notImplemented(
      `Geojson type ${geojson.type} is not supported`);
    throw err;
  }
}
