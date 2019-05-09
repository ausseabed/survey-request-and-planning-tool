var express = require('express');
var _ = require('lodash');
const boom = require('boom');

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated, geojsonToMultiPolygon
  } from '../utils';
import { HippRequest } from '../../lib/entity/hipp-request';


var router = express.Router();

// Gets a list of HIPP Requests
router.get('/', asyncMiddleware(async function (req, res) {

  let projects = await getConnection()
  .getRepository(HippRequest)
  .createQueryBuilder("hipp_request")
  .select(["hipp_request.id", "hipp_request.name",
    "hipp_request.requestDate", "hipp_request.areaName"])
  .where(
    `hipp_request.deleted = :deleted`,
    {deleted: false}
  )
  .getMany();

  return res.json(projects);
}));


// gets a single HIPP Request
router.get('/:id', asyncMiddleware(async function (req, res) {
  let hippRequest = await getConnection()
  .getRepository(HippRequest)
  .findOne(
    req.params.id,
    {
      relations: [
        "requestingAgency",
      ]
    }
  );

  if (!hippRequest || hippRequest.deleted) {
    let err = boom.notFound(
      `HippRequest ${req.params.id} does not exist`);
    throw err;
  }

  // don't return the deleted flag
  delete hippRequest.deleted;

  return res.json(hippRequest);
}));


// creates a new organisation
router.post('/', isAuthenticated, asyncMiddleware(async function (req, res) {

  var hippRequest = new HippRequest()
  _.merge(hippRequest, req.body)

  if (!_.isNil(req.body.areaOfInterest)) {
    let geojson = geojsonToMultiPolygon(req.body.areaOfInterest)
    hippRequest.areaOfInterest = geojson
  }


  hippRequest = await getConnection()
  .getRepository(HippRequest)
  .save(hippRequest)

  // because the saved version of org doesn't include all attribs
  hippRequest = await getConnection()
  .getRepository(HippRequest)
  .findOne(
    hippRequest.id,
    {
      relations: [
        "requestingAgency",
      ]
    }
  )
  return res.json(hippRequest)
}));


module.exports = router;
