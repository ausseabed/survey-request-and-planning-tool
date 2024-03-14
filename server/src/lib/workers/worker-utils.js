import simplify from '@turf/simplify';
var tj = require('@mapbox/togeojson');
import { DOMParser } from '@xmldom/xmldom';
var shp = require('shpjs');
import { findGeometries, Geometry } from "geography-markup-language";
import { featureCollection } from "@turf/helpers";
import flip from "@turf/flip";

import { geojsonToFeatureList } from '../../lib/entity/utils';

export const processGeojson = (geojson) => {
  let simplifyOptions = { tolerance: 0.0005, highQuality: false, mutate: true };
  let simpleGeojson = simplify(geojson, simplifyOptions);
  let features = geojsonToFeatureList(simpleGeojson);
  return features;
};
  
export const getFeaturesFromZip = async (data) => {
  let geojson = await shp.parseZip(data);
  return processGeojson(geojson);
};
  
export const getFeaturesFromJson = async (data) => {
  let geojson = JSON.parse(data);
  return processGeojson(geojson);
};
  
export const getFeaturesFromKml = async (data) => {
  let str = data.toString();
  let kml = new DOMParser().parseFromString(str);
  let geojson = tj.kml(kml);
  return processGeojson(geojson);
}
  
export const getFeaturesFromGml = async (data) => {
  let str = data.toString();
  // gets the xml elements that define geometries as an array
  const geometriesXml = findGeometries(str);
  
  // convert each xml element into a geojson representation
  // unfortunately this drop any properties (eg; name, priority)
  // included in the gml
  let geojsonFeatures = geometriesXml.map((geomXml) => {
    let geom = Geometry(geomXml, { format: "geojson" });
    // for some reason this lib flips the lat/long, so flip
    // them back
    geom = flip(geom);
    return geom;
  });
  let geojson = featureCollection(geojsonFeatures);
  return processGeojson(geojson);
}
