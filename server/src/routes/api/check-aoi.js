var express = require('express');
var _ = require('lodash');
const boom = require('boom');

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated } from '../utils';

var router = express.Router();


router.post('/', isAuthenticated, function (req, res) {
  console.log(req.body);

  return res.json({
    'matching': []
  });
})

module.exports = router;
