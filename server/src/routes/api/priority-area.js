import _ from 'lodash';
import * as Boom from '@hapi/boom';
import express from 'express';
import formidable from 'formidable';
import fs from 'fs';
import stream from 'stream';
import workerFarm from 'worker-farm';

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated } from '../utils';
import { PriorityArea } from '../../lib/entity/priority-area';

const router = express.Router();


//upload for a new template, form includes fields that are needed by DB
router.put(
  '/upload',
  [isAuthenticated],
  asyncMiddleware(async function (req, res)
{
  console.log("upload");

}));

module.exports = router;
