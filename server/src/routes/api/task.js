import _ from 'lodash';
import * as Boom from '@hapi/boom';
import express from 'express';
import fs from 'fs';
import stream from 'stream';
import workerFarm from 'worker-farm';

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated } from '../utils';
import { Task } from '../../lib/entity/task';

const router = express.Router();


// Gets a single task by id
router.get(
  '/:id',
  [isAuthenticated],
  asyncMiddleware(async function (req, res)
{
  const id = req.params.id;
  let task = await getConnection()
  .getRepository(Task)
  .findOne(id);

  if (_.isNil(task)) {
    let err = Boom.notFound(`Task ${id} does not exist`);
    throw err;
  }

  return res.json(task);
}));


module.exports = router;
