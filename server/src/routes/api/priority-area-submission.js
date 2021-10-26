var express = require('express');
var _ = require('lodash');
import * as Boom from '@hapi/boom';
var archiver = require('archiver');
var p = require('path');
const fs = require('fs');
import { feature, featureCollection } from "@turf/helpers";

import { getConnection } from 'typeorm';

import {
  asyncMiddleware, isAuthenticated, geojsonToMultiPolygon, hasPermission,
  permitCustodianBasedPermission
} from '../utils';
import { PriorityAreaSubmission }
  from '../../lib/entity/priority-area-submission';
import {
  PREFERRED_TIMEFRAME_OPTIONS, RISK_RATING_OPTIONS,
  REQUIRED_DATA_QUALITY_OPTIONS, PRIORITY_OPTIONS
}
  from '../../lib/entity/priority-area';
import {
  IDENTIFIED_AREA_NAME_SUGGESTIONS,
  GEOGRAPHICAL_AREA_NAME_SUGGESTIONS
}
  from '../../lib/entity/priority-area-submission';
import { RecordState } from '../../lib/entity/record-state';
import { shpBuilderFactory } from '../../lib/shp-builder';

import { updateRecordState } from '../state-management';


var router = express.Router();

router.get('/preferred-timeframe-options', async function (req, res) {
  return res.json(PREFERRED_TIMEFRAME_OPTIONS);
});

router.get('/risk-rating-options', async function (req, res) {
  return res.json(RISK_RATING_OPTIONS);
});

router.get('/required-data-quality-options', async function (req, res) {
  return res.json(REQUIRED_DATA_QUALITY_OPTIONS);
});

router.get('/priority-options', async function (req, res) {
  return res.json(PRIORITY_OPTIONS);
});

router.get('/identified-area-options', async function (req, res) {
  return res.json(IDENTIFIED_AREA_NAME_SUGGESTIONS);
});

router.get('/geographical-area-options', async function (req, res) {
  return res.json(GEOGRAPHICAL_AREA_NAME_SUGGESTIONS);
});

const PRIORITY_AREA_SUBMISSION_RELATIONS = [
  'submittingOrganisation',
  'citedOrganisation',
  'custodian',
  'recordState',
  'priorityAreas',
];

// Gets a list of PriorityAreaSubmissions
router.get('/', isAuthenticated, asyncMiddleware(async function (req, res) {
  let { start, limit, filter } = req.query;

  start = _.isNil(start) ? 0 : start;
  limit = _.isNil(limit) ? 20 : limit;
  limit = limit > 100 ? 100 : limit;  // don't ever allow more than 100

  let pasQuery = getConnection()
    .getRepository(PriorityAreaSubmission)
    .createQueryBuilder("priority_area_submission")
    .select([
      "priority_area_submission.id",
      "priority_area_submission.contactPerson",
      "priority_area_submission.contactEmail",
      "priority_area_submission.created",
      "priority_area_submission.lastModified",
      "priority_area_submission.citation",
      "priority_area_submission.citedContactName",
      "priority_area_submission.citedContactEmail",
      "priority_area_submission.riskIssues",
      "priority_area_submission.furtherInformation",
    ])
    .leftJoinAndSelect(
      "priority_area_submission.submittingOrganisation", "submittingOrganisation")
    .leftJoinAndSelect(
      "priority_area_submission.citedOrganisation", "citedOrganisation")
    .leftJoinAndSelect(
      "priority_area_submission.custodian", "custodian")
    .leftJoinAndSelect(
      "priority_area_submission.recordState", "recordState");

  if (hasPermission(req.user.role, 'canViewAllPriorityAreaSubmissions')) {
    // then no additional where clauses
  } else if (hasPermission(req.user.role, 'canViewCustodianPriorityAreaSubmissions')) {
    // need to filter list to include only hipp requests that include the
    // custodian this user is assigned.
    pasQuery = pasQuery
      .where(
        `(custodian.id = :custodianId)`,
        { custodianId: req.user.custodian.id }
      );
  } else {
    return res.json([]);
  }

  // this order by last modified
  pasQuery = pasQuery.orderBy("priority_area_submission.lastModified");

  let count = await pasQuery.getCount();

  pasQuery = pasQuery
    .offset(start)
    .limit(limit);

  const pasList = await pasQuery.getMany();
  return res.json({
    count: count,
    data: pasList
  });
}));


// gets geospatial features as geojson associated with a specific priority
// area suubmission
router.get(
  '/:id/geometry',
  [
    isAuthenticated,
    permitCustodianBasedPermission({
      entityType: PriorityAreaSubmission,
      custodianAttributes: ['custodian'],
      allowedPermissionAll: 'canViewAllPriorityAreaSubmissions',
      allowedPermissionCustodian: 'canViewCustodianPriorityAreaSubmissions'
    })
  ],
  asyncMiddleware(async function (req, res) {

    let pas = await getConnection()
      .getRepository(PriorityAreaSubmission)
      .findOne(req.params.id);

    if (!pas) {
      let err = Boom.notFound(
        `PriorityAreaSubmission ${req.params.id} does not exist`);
      throw err;
    }

    const pas2 = await getConnection()
      .createQueryBuilder()
      .select([`ST_AsGeoJSON(ST_Collect("extent")) as geojson`])
      .from(subQuery => {
        return subQuery
          .select(`geom`, 'extent')
          .addSelect(`name`, 'name')
          .from('priority_area')
          .where(`"priorityAreaSubmissionSubmissionId" = :id`, { id: req.params.id });
      }, "extent")
      .getRawOne();

    res.set('Content-Type', 'application/json');
    return res.send(pas2.geojson);
  }));


// gets a shapefile including the geometry and metadata for this priority
// area submission. Multiple features will be included, one per priority
// area included in this submission
router.get(
  '/:id/shp',
  [
    isAuthenticated,
    permitCustodianBasedPermission({
      entityType: PriorityAreaSubmission,
      custodianAttributes: ['custodian'],
      allowedPermissionAll: 'canViewAllPriorityAreaSubmissions',
      allowedPermissionCustodian: 'canViewCustodianPriorityAreaSubmissions'
    })
  ],
  asyncMiddleware(async function (req, res) {

    let priorityAreaSubmission = await getConnection()
      .getRepository(PriorityAreaSubmission)
      .findOne(
        req.params.id,
        {
          relations: [
            "submittingOrganisation",
          ]
        }
      );

    if (!priorityAreaSubmission) {
      let err = Boom.notFound(
        `Priority Area Submission ${req.params.id} does not exist`);
      throw err;
    }

    const fname = _.isNil(priorityAreaSubmission.submittingOrganisation) ?
      priorityAreaSubmission.id :
      priorityAreaSubmission.submittingOrganisation.name.replace(' ', '-');

    const shpBuilder = shpBuilderFactory('priority-area-submission')
    const tmpDir = shpBuilder.build(priorityAreaSubmission.id, fname)

    res.on('finish', () => {
      // delete the contents of the temp direstory now that the data has been
      // downloaded
      tmpDir.removeCallback()
    });

    // from https://github.com/archiverjs/node-archiver/blob/master/examples/express.js
    var archive = archiver('zip');

    archive.on('error', function (err) {
      res.status(500).send({ error: err.message });
    });

    //on stream closed we can end the request
    archive.on('end', function () {
      console.log('Zipped %d bytes', archive.pointer());
    });

    //set the archive name
    res.attachment(`${fname}.zip`);

    //this is the streaming magic
    archive.pipe(res);

    var files = fs.readdirSync(tmpDir.name).map((fn) => { return `${tmpDir.name}/${fn}` })

    for (var i in files) {
      archive.file(files[i], { name: p.basename(files[i]) });
    }

    archive.finalize();
  }));


// gets a single Priority Area Submission
router.get(
  '/:id',
  [
    isAuthenticated,
    permitCustodianBasedPermission({
      entityType: PriorityAreaSubmission,
      custodianAttributes: ['custodian'],
      allowedPermissionAll: 'canViewAllPriorityAreaSubmissions',
      allowedPermissionCustodian: 'canViewCustodianPriorityAreaSubmissions'
    })
  ],
  asyncMiddleware(async function (req, res) {

    let pas = await getConnection()
      .getRepository(PriorityAreaSubmission)
      .findOne(
        req.params.id,
        {
          relations: PRIORITY_AREA_SUBMISSION_RELATIONS
        }
      );

    if (!pas) {
      let err = Boom.notFound(
        `PriorityAreaSubmission ${req.params.id} does not exist`);
      throw err;
    }

    return res.json(pas);
  }));


// creates or updates a Priority Area Submission
router.post(
  '/',
  [
    isAuthenticated,
    permitCustodianBasedPermission({
      entityType: PriorityAreaSubmission,
      custodianAttributes: ['custodian'],
      allowedPermissionAll: 'canEditAllPriorityAreaSubmissions',
      allowedPermissionCustodian: 'canEditCustodianPriorityAreaSubmission',
      allowedPermissionNoEntityId: 'canAddPriorityAreaSubmission',
    })
  ],
  asyncMiddleware(async function (req, res) {

    var pas = new PriorityAreaSubmission();
    _.merge(pas, req.body);

    // DO NOT update the record state here. Record state changes should only
    // happen in the record state handlers
    delete pas.recordState;
    // created is set by default when new entry added to db table
    delete pas.created;

    pas.lastModified = Date.now();
    pas.custodian = req.user.custodian;

    // Remove the link between the upload processing task and this PAS. It is
    // assumed that by saving the user has reviewed all processed priority areas
    // and included/edited those they want linked to this PAS (and have been
    // included in the post body).
    pas.uploadTaskId = null;

    await getConnection().transaction(async transactionalEntityManager => {
      const isNew = _.isNil(pas.id);
      if (isNew) {
        // if it's new it won;t have an id, so we need to save it so we have
        // an id to pass to the recordState.recordId attrib
        // not idea, but fix requires reworking db schema
        pas = await getConnection()
          .getRepository(PriorityAreaSubmission)
          .save(pas);

        const message = `Created new Priority Area Submission`;
        const recordState = new RecordState();
        recordState.changeDescription = message;
        recordState.state = 'drafted';
        recordState.previous = undefined;
        recordState.user = req.user;
        recordState.created = Date.now();
        recordState.recordType = 'priority area submission';
        recordState.version = 1;
        recordState.recordId = pas.id;
        pas.recordState = recordState;
      }

      pas = await getConnection()
        .getRepository(PriorityAreaSubmission)
        .save(pas);
    });

    // because the saved version of custodian doesn't include all attribs
    pas = await getConnection()
      .getRepository(PriorityAreaSubmission)
      .findOne(
        pas.id,
        {
          relations: PRIORITY_AREA_SUBMISSION_RELATIONS
        }
      );

    return res.json(pas);
  }));


// deletes a Priority Area Submission
// deletes by removing from database, no deleted flag for PASs
router.delete(
  '/:id',
  [
    isAuthenticated,
    permitCustodianBasedPermission({
      entityType: PriorityAreaSubmission,
      custodianAttributes: ['custodian'],
      allowedPermissionAll: 'canEditAllPriorityAreaSubmissions',
      allowedPermissionCustodian: 'canEditCustodianPriorityAreaSubmission',
    })
  ],
  asyncMiddleware(async function (req, res) {

    const pasRepo = getConnection().getRepository(PriorityAreaSubmission);

    let pas = await pasRepo.findOne(req.params.id);

    if (!pas) {
      let err = Boom.notFound(
        `PriorityAreaSubmission ${req.params.id} does not exist, cannot delete`);
      throw err;
    }

    await pasRepo.delete(pas.id);

    const responseSuccess = { success: 'Deleted' };
    return res.json(responseSuccess);
  }));


module.exports = router;
