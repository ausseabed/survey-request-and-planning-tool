import _ from 'lodash'
import boom from 'boom'
import express from 'express'
import formidable from 'formidable'
import fs from 'fs'
import stream from 'stream'


import { getConnection } from 'typeorm'

import { asyncMiddleware, isAuthenticated } from '../utils'
import { ReportTemplate, REPORT_TEMPLATE_TYPES }
  from '../../lib/entity/report-template'

const router = express.Router()

// Gets a list of organisations
router.get('/', isAuthenticated, asyncMiddleware(async function (req, res) {
  const whereOpts = {};
  if (!_.isNil(req.query['active'])) {
    whereOpts.active = req.query['active'];
  }

  let templates = await getConnection()
  .getRepository(ReportTemplate)
  .find({
    where:whereOpts,
    order: {created: 'DESC'}
  });
  return res.json(templates);
}));

router.get(
  '/:id/download',
  isAuthenticated,
  asyncMiddleware(async function (req, res) {

    const id = req.params.id;

    if (_.isNil(id) || id.length == 0) {
      let err = boom.notFound(`Must template id ` +
        `(eg; /api/report-template/:id/download)`);
      throw err;
    }

    // specify what fields to select because the blob is not selected by
    // default
    const rtrepo = getConnection().getRepository(ReportTemplate)
    const rt = await rtrepo
    .createQueryBuilder("report_template")
    .select([
      "report_template.id",
      "report_template.fileName",
      "report_template.mimeType",
      "report_template.storage",
      "report_template.blob"
    ])
    .where(
      `"id" = :id`,
      {id: id}
    )
    .getOne();

    if (_.isNil(rt)) {
      let err = boom.notFound(`Report template with id ${id} does not exist`);
      throw err;
    }

    let data = undefined;
    if (rt.storage == 'db') {
      data = rt.blob;

      const readStream = new stream.PassThrough();
      readStream.end(data);
      res.set(
        'Content-disposition', 'attachment; filename=' + rt.fileName);
      res.set('Content-length', rt.blob.length);
      res.set('Content-Type', rt.mimeType);
      readStream.pipe(res);

    } else if (surveyFile.storage == 's3') {
      let err = boom.notImplemented(
        `ReportTemplate in s3 not implemented yet`);
      throw err;
    } else {
      let err = boom.badImplementation(
        `ReportTemplate.storage should always be db or s3`);
      throw err;
    }

}));

async function saveAndUpdateReportType(reportTemplate) {
  // Saves the report template, and also changes any existing active report
  // templates of the same `templateType` to active = false

  await getConnection().transaction(async transactionalEntityManager => {
    await getConnection()
    .createQueryBuilder()
    .update(ReportTemplate)
    .set({ active: false})
    .where(`"templateType" = :tt`, { tt: reportTemplate.templateType })
    .execute();

    await getConnection().getRepository(ReportTemplate)
    .save(reportTemplate)
  })
}

//upload for a new template, form includes fields that are needed by DB
router.put('/upload', isAuthenticated,
  asyncMiddleware(async function (req, res) {

  let rt = new ReportTemplate()
  rt.created = Date.now()
  rt.storage = 'db'
  // refer: https://stackoverflow.com/questions/4212861/what-is-a-correct-mime-type-for-docx-pptx-etc
  rt.mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

  new formidable.IncomingForm().parse(req)
  .on('field', (name, field) => {
    rt[name] = field
  })
  .on('file', async (name, file) => {
    rt.fileName = file.name
    const data = fs.readFileSync(file.path);
    rt.blob = data
  })
  .on('aborted', () => {
    console.error('Request aborted by the user')
  })
  .on('error', (err) => {
    console.error('Error', err)
    throw err
  })
  .on('end', async () => {
    await saveAndUpdateReportType(rt)
    res.end();
  })
}));


// Gets a list of project metadata
router.get('/types', async function (req, res) {
  return res.json(REPORT_TEMPLATE_TYPES);
});


module.exports = router;
