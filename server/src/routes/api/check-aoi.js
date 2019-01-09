var express = require('express');
var _ = require('lodash');
const boom = require('boom');

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated, geojsonToMultiPolygon }
  from '../utils';
import { ProjectMetadata } from '../../lib/entity/project-metadata';

var router = express.Router();

router.post('/', isAuthenticated, asyncMiddleware(async function (req, res) {
  // Accepts a geojson object (assumed already in epsg:4326) and returns
  // a list of all projects that have areaOfInterests that intersect this
  // geojson feature.
  const geojson = geojsonToMultiPolygon(req.body);
  const geomString = JSON.stringify(geojson.geometry);

  let projects = await getConnection()
  .getRepository(ProjectMetadata)
  .createQueryBuilder("project_metadata")
  .where(
    `ST_Intersects(
      project_metadata.areaOfInterest,
      ST_SetSRID(ST_GeomFromGeoJSON(:geomStr),4326)
    )`,
    {geomStr: geomString}
  )
  .getMany();

  return res.json(projects);
}))

module.exports = router;
