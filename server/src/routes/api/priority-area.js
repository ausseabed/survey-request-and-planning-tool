import _ from 'lodash';
import * as Boom from '@hapi/boom';
import express from 'express';
import formidable from 'formidable';
import fs from 'fs';
import stream from 'stream';
import workerFarm from 'worker-farm';

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated } from '../utils';
import { MarinePark } from '../../lib/entity/marine-park';
import { PriorityArea } from '../../lib/entity/priority-area';
import { PriorityAreaSubmission } from '../../lib/entity/priority-area-submission';
import { Task } from '../../lib/entity/task';

const router = express.Router();


// Gets a single priority by id
router.get(
  '/:id',
  [isAuthenticated],
  asyncMiddleware(async function (req, res) {
    const id = req.params.id;

    let pa = await getConnection()
      .getRepository(PriorityArea)
      .findOne(id);

    if (_.isNil(pa)) {
      let err = Boom.notFound(`Priority Area ${id} does not exist`);
      throw err;
    }

    return res.json(pa);
  }));

router.get(
  '/:id/thumbnail',
  [isAuthenticated],
  asyncMiddleware(async function (req, res) {
    const id = req.params.id;

    let pa = await getConnection()
      .getRepository(PriorityArea)
      .findOne(
        id,
        { select: ["thumbnail"] }
      );

    if (_.isNil(pa)) {
      let err = Boom.notFound(`No priority area found with id ${id}`);
      throw err;
    }

    res.set('Content-length', pa.thumbnail.length);
    res.set('Content-Type', 'image/png');

    const readStream = new stream.PassThrough();
    readStream.end(pa.thumbnail);
    readStream.pipe(res);
  }));

router.get(
  '/:id/intersections',
  [isAuthenticated],
  asyncMiddleware(async function (req, res) {
    // gets a list of things (eg; Marine Parks) that this Area of Interest
    // intersects
    const id = req.params.id;


    let intersectsQuery = getConnection()
      .getRepository(MarinePark)
      .createQueryBuilder("marine_park")
      .leftJoinAndSelect(
        PriorityArea,
        "priority_area",
        "ST_Intersects(marine_park.geometry, priority_area.geom)"
      ).andWhere(
        `priority_area.id = :aid`,
        { aid: id }
      );

    let intersectingItems = await intersectsQuery.getMany();
    let intersectingItemsResp = intersectingItems.map(ii => {
      return [
        {
          key: "netname",
          value: ii.netname
        },
        {
          key: "resname",
          value: ii.resname
        },
        {
          key: "zonename",
          value: ii.zonename
        }
      ]
    });
    return res.json(intersectingItemsResp);
  }));

//create a new area of interest based on geometry alone
// accepts a body full of geojson
router.post(
  '/new-from-geometry',
  [isAuthenticated],
  asyncMiddleware(async function (req, res) {
    let task = new Task();
    task.statusMessage = "Initialising...";
    let fields = {};

    task.blobFileName = 'new_geometry.geojson';
    task.blob = req.body;

    console.log(task.blob);


    let aoiSubmissionId = req.query.aoiSubmissionId;
    if (_.isNil(aoiSubmissionId)) {
      let err = Boom.badRequest(
        "No `aoiSubmissionId` given via param data");
      throw err;
    }

    console.log(aoiSubmissionId);

    let taskId = undefined;

    await getConnection().transaction(async transactionalEntityManager => {
      const { id } = await getConnection()
        .getRepository(Task)
        .save(task);

      let pasQuery = await getConnection()
        .createQueryBuilder()
        .update(PriorityAreaSubmission)
        .set({ uploadTask: task })
        .where("id = :id", { id: aoiSubmissionId })
        .execute();

      taskId = id;
    });

    const worker = workerFarm(
      { maxRetries: 3 },
      require.resolve('../../lib/workers/priority-area-processor')
    );
    worker(taskId, function (err, outp) {
      if (err) {
        console.log("error");
        console.log(err);
      }
      workerFarm.end(worker);
    });
    res.json({ taskId: taskId });


  }));


//upload for a new template, form includes fields that are needed by DB
router.put(
  '/upload',
  [isAuthenticated],
  asyncMiddleware(async function (req, res) {
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
        if (!_.has(fields, 'priorityAreaSubmissionId')) {
          let err = Boom.badRequest(
            "No `priorityAreaSubmissionId` given on form data");
          throw err;
        }

        let pasId = fields.priorityAreaSubmissionId;
        let taskId = undefined;

        await getConnection().transaction(async transactionalEntityManager => {
          const { id } = await getConnection()
            .getRepository(Task)
            .save(task);

          let pasQuery = await getConnection()
            .createQueryBuilder()
            .update(PriorityAreaSubmission)
            .set({ uploadTask: task })
            .where("id = :id", { id: pasId })
            .execute();

          taskId = id;
        });

        const worker = workerFarm(
          { maxRetries: 3 },
          require.resolve('../../lib/workers/priority-area-processor')
        );
        worker(taskId, function (err, outp) {
          if (err) {
            console.log("error");
            console.log(err);
          }
          workerFarm.end(worker);
        });
        res.json({ taskId: taskId });
      });

  }));

module.exports = router;
