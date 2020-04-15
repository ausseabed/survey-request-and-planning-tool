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
import { Task } from '../../lib/entity/task';

const router = express.Router();


//upload for a new template, form includes fields that are needed by DB
router.put(
  '/upload',
  [isAuthenticated],
  asyncMiddleware(async function (req, res)
{
  console.log("upload");

  let task = new Task();
  let fields = {};

  new formidable.IncomingForm().parse(req)
    .on('field', (name, field) => {
      fields[name] = field;
    })
    .on('file', async (name, file) => {
      task.blobFileName = file.name;
      const data = fs.readFileSync(file.path);
      task.blob = data;
    })
    .on('aborted', () => {
      console.error('Request aborted by the user');
    })
    .on('error', (err) => {
      console.error('Error', err);
      throw err;
    })
    .on('end', async () => {
      const { id } = await getConnection()
        .getRepository(Task)
        .save(task);

      // const worker = workerFarm(
      //   require.resolve('../../lib/workers/coverage-processor'));
      // worker(coverageId, function (err, outp) {
      //   if (err) {
      //     console.log("error");
      //     console.log(err);
      //   }
      //   console.log(outp)
      //   workerFarm.end(worker)
      // });
      console.log(fields);
      res.json({id: id});
    });

}));

module.exports = router;
