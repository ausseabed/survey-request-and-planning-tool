var express = require('express');
const formidable = require('formidable')
const fs = require('fs');
const stream = require('stream');
var _ = require('lodash');
const boom = require('boom');

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated, isUuid, permitCustodianBasedPermission }
  from '../utils';
import { Attachment } from '../../lib/entity/attachment';
import { HippRequest } from '../../lib/entity/hipp-request';
import { HippRequestAttachment } from '../../lib/entity/hipp-request-attachment';
import { ProjectMetadata } from '../../lib/entity/project-metadata';
import { SurveyAttachment } from '../../lib/entity/survey-attachment';


 // How do the attachments link to each entity. 'survey' is a projectMetadata
 // entry. A projectMetadata entries attachments are linked via the
 // SurveyAttachment table.
 // custodian attributes are used for the authorisation middleware check
const attachmentmap = {
  'survey-plan': {
    entity: ProjectMetadata,
    attachment: SurveyAttachment,
    custodianAttributes: ['custodians'],
  },
  'survey-request': {
    entity: HippRequest,
    attachment: HippRequestAttachment,
    custodianAttributes: ['custodians'],
  },
}

function attachmentPermit(allowedPermissionAll, allowedPermissionCustodian) {
  const entityTypeFn = (request) => {
    let attachDetails = attachmentmap[request.params.entityType]
    return attachDetails.entity
  }
  const custodianAttrsFn = (request) => {
    let attachDetails = attachmentmap[request.params.entityType]
    return attachDetails.custodianAttributes
  }
  return permitCustodianBasedPermission({
    entityTypeFn:entityTypeFn,
    custodianAttributesFn:custodianAttrsFn,
    allowedPermissionAll,
    allowedPermissionCustodian})
}


var router = express.Router();

router.delete(
  '/:entityType/:id/delete/:fileId',
  [
    isAuthenticated,
    attachmentPermit('canDeleteAllAttachments', 'canDeleteCustodianAttachments')
  ],
  asyncMiddleware(async function(req, res){

  const entityType = req.params.entityType;
  const id = req.params.id;
  const fileId = req.params.fileId;

  if (!id || !fileId) {
    let err = boom.notFound(
      `Must provide project id and file id (eg; /:id/delete/:fileId)`);
    throw err;
  }

  let attachDetails = attachmentmap[entityType]

  await getConnection().transaction(async transactionalEntityManager => {
    // need to delete from the table that links an entity such as a
    // 'hipprequest', and then to also delete the file from the attachment
    // table itself
    // wrapped in transaction as these both need to happen
    const attachRepo = getConnection().getRepository(attachDetails.attachment)
    await attachRepo.createQueryBuilder()
      .delete()
      .from(attachDetails.attachment)
      .where(`"attachmentId" = :id`, {id: fileId})
      .execute();
    await attachRepo.createQueryBuilder()
      .delete()
      .from(Attachment)
      .where(`"id" = :id`, {id: fileId})
      .execute();
  });

  res.end();
}));


router.get(
  '/:entityType/:id/download/:name',
  [
    isAuthenticated,
    attachmentPermit('canViewAllAttachments', 'canViewCustodianAttachments')
  ],
  asyncMiddleware(async function(req, res){

  const entityType = req.params.entityType;
  const id = req.params.id;
  const fileName = req.params.name;

  if (!entityType || !id || !fileName) {
    let err = boom.notFound(`Must provide entity type, project id and ` +
      `file name (eg; :entityType/:id/download/:name)`);
    throw err;
  }

  let attachDetails = attachmentmap[entityType]
  const attachRepo = getConnection().getRepository(attachDetails.attachment)

  let surveyFile = undefined;

  // support giving the unique survey file UUID for downloads. otherwise
  // there is no way to download a specific file that shares the same name as
  // another file in this project.
  if (isUuid(fileName)) {
    surveyFile = await attachRepo
    .createQueryBuilder("survey_file")
    .leftJoinAndSelect("survey_file.attachment", "attachment")
    .select(["survey_file.id", "attachment.fileName", "attachment.storage", "attachment.blob"])
    .where(
      `"entityId" = :id`,
      {id: id}
    ).andWhere(
      `"attachmentId" = :fileName`,
      {fileName: fileName}
    )
    .getOne();
  } else {
    surveyFile = await attachRepo
    .createQueryBuilder("survey_file")
    .leftJoinAndSelect("survey_file.attachment", "attachment")
    .select(["survey_file.id", "attachment.fileName", "attachment.storage", "attachment.blob"])
    .where(
      `"entityId" = :id`,
      {id: id}
    ).andWhere(
      `"attachment"."fileName" = :fileName`,
      {fileName: fileName}
    )
    .getOne();
  }

  surveyFile = surveyFile.attachment

  let data = undefined;
  if (surveyFile.storage == 'db') {
    data = surveyFile.blob;

    const readStream = new stream.PassThrough();
    readStream.end(data);
    res.set(
      'Content-disposition', 'attachment; filename=' + surveyFile.fileName);
    res.set('Content-length', data.length);
    // res.set(
    //   'Content-length', data.length);
    // response.set('Content-Type', 'text/plain');
    readStream.pipe(res);

  } else if (surveyFile.storage == 's3') {
    let err = boom.notImplemented(
      `SurveyFile s3 not implemented yet`);
    throw err;
  } else {
    let err = boom.badImplementation(
      `SurveyFile.storage should always be db or s3`);
    throw err;
  }
}));



router.get(
  '/:entityType/:id',
  [
    isAuthenticated,
    attachmentPermit('canViewAllAttachments', 'canViewCustodianAttachments')
  ],
  asyncMiddleware(async function(req, res){
  // gets a  list of survey files for the given project id

  const entityType = req.params.entityType;
  const id = req.params.id;

  // only select the columns needed. Should avoid getting the blob column here
  // as it may be large.
  let attachDetails = attachmentmap[entityType]
  const enitityRepo = getConnection().getRepository(attachDetails.attachment)
  let surveyFiles = await enitityRepo
  .createQueryBuilder("entity_attachment")
  .leftJoinAndSelect("entity_attachment.attachment", "attachment")
  .where(
    `"entityId" = :id`,
    {id: id}
  )
  .orderBy("attachment.fileName")
  .getMany();

  let entityAttachments = surveyFiles.map((ea) => {return ea.attachment})
  return res.json(entityAttachments);
}));


async function saveFile(file, entity, attachRepo) {
  let attachment = new Attachment();
  attachment.fileName = file.name;
  // UTC milliseconds (converted to date by TypeORM transformer)
  attachment.created = Date.now();

  const storage = "db";
  attachment.storage = storage;

  const data = fs.readFileSync(file.path);
  attachment.blob = data;

  attachment = await getConnection()
  .getRepository(Attachment)
  .save(attachment);

  let entityAttachment = {}
  entityAttachment.entity = entity
  entityAttachment.attachment = attachment

  entityAttachment = await attachRepo.save(entityAttachment)
  return entityAttachment;
}

router.put(
  '/:entityType/:id/upload',
  [
    isAuthenticated,
    attachmentPermit('canUploadAllAttachments', 'canUploadCustodianAttachments')
  ],
  asyncMiddleware(async function (req, res) {

  const entityType = req.params.entityType;
  const id = req.params.id;

  // check entity exists with this id,
  let attachDetails = attachmentmap[entityType]
  const enitityRepo = getConnection().getRepository(attachDetails.entity)
  let entity = await enitityRepo.findOne(req.params.id);
  if (!entity) {
    let err = boom.notFound(
      `${entityType} ${id} does not exist, cannot save file`);
    throw err;
  }

  const attachRepo = getConnection().getRepository(attachDetails.attachment)


  new formidable.IncomingForm().parse(req)
  .on('field', (name, field) => {
    console.log('Field', name, field)
  })
  .on('file', async (name, file) => {
    await saveFile(file, entity, attachRepo);
    res.end();
  })
  .on('aborted', () => {
    console.error('Request aborted by the user')
  })
  .on('error', (err) => {
    console.error('Error', err)
    throw err
  })
  .on('end', () => {

  })
}));


module.exports = router;
