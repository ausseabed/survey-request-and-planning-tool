var express = require('express');
var _ = require('lodash');
import * as Boom from '@hapi/boom';
import { feature, featureCollection } from "@turf/helpers";

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated, geojsonToMultiPolygon, hasPermission,
  permitCustodianBasedPermission } from '../utils';
import { PriorityAreaSubmission}
  from '../../lib/entity/priority-area-submission';
import { PREFERRED_TIMEFRAME_OPTIONS, RISK_RATING_OPTIONS,
  REQUIRED_DATA_QUALITY_OPTIONS, DATA_IMPORTANCE_OPTIONS }
  from '../../lib/entity/priority-area';


import { updateRecordState } from '../state-management';


var router = express.Router();

router.get('/risk_rating_options', async function (req, res) {
  return res.json(RISK_RATING_OPTIONS);
});

router.get('/required_data_quality_options', async function (req, res) {
  return res.json(REQUIRED_DATA_QUALITY_OPTIONS);
});

router.get('/data_importance_options', async function (req, res) {
  return res.json(DATA_IMPORTANCE_OPTIONS);
});

// Gets a list of PriorityAreaSubmissions
router.get('/', isAuthenticated, asyncMiddleware(async function (req, res) {

  let pasQuery = getConnection()
  .getRepository(PriorityAreaSubmission)
  .createQueryBuilder("priority_area_submission")
  .select([
    "priority_area_submission.id",
    "priority_area_submission.contactPerson",
    "priority_area_submission.contactEmail",
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
      {custodianId: req.user.custodian.id}
    );
  } else {
    return res.json([]);
  }

  // this order by last modified
  pasQuery = pasQuery.orderBy("priority_area_submission.lastModified");

  const pasList = await pasQuery.getMany();
  return res.json(pasList);
}));

// up to here


// gets a single Priority Area Submission
router.get(
  '/:id',
  [
    isAuthenticated,
    permitCustodianBasedPermission({
      entityType:PriorityAreaSubmission,
      custodianAttributes: ['custodian'],
      allowedPermissionAll: 'canViewAllPriorityAreaSubmissions',
      allowedPermissionCustodian: 'canViewCustodianPriorityAreaSubmissions'})
  ],
  asyncMiddleware(async function (req, res) {

  let pas = await getConnection()
  .getRepository(PriorityAreaSubmission)
  .findOne(
    req.params.id,
    {
      relations: [
        "submittingOrganisation",
        "citedOrganisation",
        "custodian",
        "recordState",
      ]
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


  // TODO fix below, would be nice to add record state when creating new record
  // But it is not required.
  // const changeDesc = _.isNil(req.body.id) ? "New record" : "Updated record"
  // const recordState = await updateRecordState(
  //   SurveyRequest, req.body.id, req.user, 'request', changeDesc);
  //
  // surveyRequest.recordState = recordState

  pas = await getConnection()
  .getRepository(PriorityAreaSubmission)
  .save(pas);

  // because the saved version of custodian doesn't include all attribs
  pas = await getConnection()
  .getRepository(PriorityAreaSubmission)
  .findOne(
    pas.id,
    {
      relations: [
        "submittingOrganisation",
        "citedOrganisation",
        "custodian",
        "recordState",
      ]
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

  let pas = await hrRepo.findOne(req.params.id);

  if (!pas) {
    let err = Boom.notFound(
      `PriorityAreaSubmission ${req.params.id} does not exist, cannot delete`);
    throw err;
  }

  await pasRepo.delete(pas.id);

  const responseSuccess = { success : 'Deleted'};
  return res.json(responseSuccess);
}));


module.exports = router;
