var express = require('express');
var _ = require('lodash');
const boom = require('boom');

import { asyncMiddleware, isAuthenticated } from '../utils';
import * as rs from '../../lib/reference-system'

var router = express.Router();

// Gets a list of valid positioning requirements
router.get('/', isAuthenticated, asyncMiddleware(async function (req, res) {

  const type = req.query.type;
  if (!type) {
    let err = boom.badRequest(
      `Must provide "type" query param`);
    throw err;
  }

  let refSys = undefined;
  if (type.toLowerCase() == 'horizontal') {
    refSys = rs.HORIZONTAL_REFERENCE_SYSTEMS;
  } else if (type.toLowerCase() == 'vertical') {
    refSys = rs.VERTICAL_REFERENCE_SYSTEMS;
  } else if (type.toLowerCase() == 'sounding') {
    refSys = rs.VERTICAL_REFERENCE_SYSTEMS;
  } else if (type.toLowerCase() == 'spheroid') {
    refSys = rs.VERTICAL_REFERENCE_SYSTEMS;
  } else {
    let err = boom.badRequest(
      `Type "${type}" not supported, expected horizontal, vertical, ` +
      `sounding, or spheroid`);
    throw err;
  }

  return res.json(refSys);
}));

module.exports = router;
