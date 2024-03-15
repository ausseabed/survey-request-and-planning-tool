import _ from 'lodash'
import * as Boom from '@hapi/boom'
import express from 'express'
import formidable from 'formidable'
import fs from 'fs'
import stream from 'stream'


import { getConnection } from 'typeorm'

import { asyncMiddleware, isAuthenticated, permitPermission,
  permitCustodianBasedPermission, isUuid } from '../utils'
import { SurveyRequest } from '../../lib/entity/survey-request'
import { SurveyPlan } from '../../lib/entity/survey-plan'
import { Document, DOCUMENT_TYPES } from '../../lib/entity/document'

const router = express.Router()


// Gets a list of documents
router.get(
  '/',
  [isAuthenticated],
  asyncMiddleware(async function (req, res) {

  const whereOpts = {};
  if (!_.isNil(req.query['active'])) {
    whereOpts.active = req.query['active'];
  }

  let docs = await getConnection()
  .getRepository(Document)
  .find({
    where:whereOpts,
    order: {created: 'DESC'}
  });
  return res.json(docs);
}));


router.get(
  '/:id/download',
  [isAuthenticated],
  asyncMiddleware(async function (req, res) {

    const id = req.params.id;

    if (_.isNil(id) || id.length == 0) {
      let err = Boom.notFound(`Must provide document id ` +
        `(eg; /api/document/:id/download)`);
      throw err;
    }

    // specify what fields to select because the blob is not selected by
    // default
    const docrepo = getConnection().getRepository(Document)
    const q = docrepo
    .createQueryBuilder("document")
    .select([
      "document.id",
      "document.fileName",
      "document.mimeType",
      "document.storage",
      "document.blob"
    ])
    if (isUuid(id)) {
      q.where(
        `"id" = :id`,
        {id: id}
      )
    } else {
      q.where(
        `"documentType" = :dt AND "active" = true`,
        {dt: id}
      )
    }
    const doc = await q.getOne();

    if (_.isNil(doc)) {
      let err = Boom.notFound(`Document with id ${id} does not exist`);
      throw err;
    }

    let data = undefined;
    if (doc.storage == 'db') {
      data = doc.blob;

      const readStream = new stream.PassThrough();
      readStream.end(data);
      if (isUuid(id)) {
        // this forces the file to be a download, usually not desired behaviour
        // when a user wishes to view a document.
        res.set(
          'Content-disposition', 'attachment; filename=' + doc.fileName);
      }

      res.set('Content-length', doc.blob.length);
      res.set('Content-Type', doc.mimeType);
      readStream.pipe(res);

    } else if (surveyFile.storage == 's3') {
      let err = Boom.notImplemented(
        `Document in s3 not implemented yet`);
      throw err;
    } else {
      let err = Boom.badImplementation(
        `Document.storage should always be db or s3`);
      throw err;
    }

}));

async function saveAndUpdateDocument(document) {
  // Saves the document, and also changes any existing active document
  // of the same `documentType` to active = false

  await getConnection().transaction(async transactionalEntityManager => {
    await getConnection()
    .createQueryBuilder()
    .update(Document)
    .set({ active: false})
    .where(`"documentType" = :dt`, { dt: document.documentType })
    .execute();

    await getConnection().getRepository(Document)
    .save(document)
  })
}

//upload for a new template, form includes fields that are needed by DB
router.put(
  '/upload',
  [isAuthenticated, permitPermission('isAdmin')],
  asyncMiddleware(async function (req, res) {

  let doc = new Document()
  doc.created = Date.now()
  doc.storage = 'db'
  doc.mimeType = 'application/pdf'

  const form = formidable({})
  .on('field', (name, field) => {
    doc[name] = field
  })
  .on('file', async (name, file) => {
    doc.fileName = file.originalFilename
    const data = fs.readFileSync(file.filepath)
    doc.blob = data
  })
  .on('aborted', () => {
    console.error('Request aborted by the user')
  })
  .on('error', (err) => {
    console.error('Error', err)
    throw err
  })
  .on('end', async () => {
    await saveAndUpdateDocument(doc)
    res.end();
  })

  await form.parse(req)

}));


// Gets a list of project metadata
router.get('/types', async function (req, res) {
  return res.json(DOCUMENT_TYPES);
});


module.exports = router;
