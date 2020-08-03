import _ from 'lodash';
import * as Boom from '@hapi/boom';
import express from 'express';
import formidable from 'formidable';
import fs from 'fs';
import stream from 'stream';
import workerFarm from 'worker-farm';

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated } from '../utils';
import { SurveyRequestAoi } from '../../lib/entity/survey-request-aoi';
import { SurveyRequest } from '../../lib/entity/survey-request';
import { Task } from '../../lib/entity/task';

import { SURVEY_REQUEST_AOI_SURVEY_STANDARD, SURVEY_REQUEST_AOI_DATA_TYPES,
  SURVEY_REQUEST_AOI_OVERALL_RISK, SURVEY_REQUEST_AOI_PREFERRED_TIMEFRAME}
  from '../../lib/entity/survey-request-aoi';

const router = express.Router();

router.get('/survey-standard', async function (req, res) {
  return res.json(SURVEY_REQUEST_AOI_SURVEY_STANDARD);
});

router.get('/preferred-timeframe', async function (req, res) {
  return res.json(SURVEY_REQUEST_AOI_PREFERRED_TIMEFRAME);
});

router.get('/overall-risk', async function (req, res) {
  return res.json(SURVEY_REQUEST_AOI_OVERALL_RISK);
});

router.get('/data-type', async function (req, res) {
  return res.json(SURVEY_REQUEST_AOI_DATA_TYPES);
});

router.get(
  '/:id',
  [isAuthenticated],
  asyncMiddleware(async function (req, res)
{
  const id = req.params.id;

  let pa = await getConnection()
    .getRepository(SurveyRequestAoi)
    .findOne(id);

  if (_.isNil(pa)) {
    let err = Boom.notFound(`Survey Request AOI ${id} does not exist`);
    throw err;
  }

  return res.json(pa);
}));

router.get(
  '/:id/thumbnail',
  [isAuthenticated],
  asyncMiddleware(async function (req, res)
{
  const id = req.params.id;

  let pa = await getConnection()
    .getRepository(SurveyRequestAoi)
    .findOne(
      id,
      { select: ["thumbnail"] }
    );

  if (_.isNil(pa)) {
    let err = Boom.notFound(`No survey request area of interest found with id ${id}`);
    throw err;
  }

  res.set('Content-length', pa.thumbnail.length);
  res.set('Content-Type', 'image/png');

  const readStream = new stream.PassThrough();
  readStream.end(pa.thumbnail);
  readStream.pipe(res);
}));


//upload for a new template, form includes fields that are needed by DB
router.put(
  '/upload',
  [isAuthenticated],
  asyncMiddleware(async function (req, res)
{
  let task = new Task();
  task.statusMessage = "Initialising...";
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
      if (!_.has(fields, 'surveyRequestId')) {
        let err = Boom.badRequest(
          "No `surveyRequestId` given on form data");
        throw err;
      }

      let pasId = fields.surveyRequestId;
      let taskId = undefined;

      await getConnection().transaction(async transactionalEntityManager => {
        const { id } = await getConnection()
          .getRepository(Task)
          .save(task);

        let pasQuery = await getConnection()
          .createQueryBuilder()
          .update(SurveyRequest)
          .set({ uploadTask: task })
          .where("id = :id", { id: pasId })
          .execute();

        taskId = id;
      });

      const worker = workerFarm(
        {maxRetries: 3},
        require.resolve('../../lib/workers/survey-request-aoi-processor')
      );
      worker(taskId, function (err, outp) {
        if (err) {
          console.log("error");
          console.log(err);
        }
        workerFarm.end(worker);
      });
      res.json({taskId: taskId});
    });

}));

module.exports = router;
