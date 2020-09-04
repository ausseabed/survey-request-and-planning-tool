import _ from 'lodash'
import * as Boom from '@hapi/boom';
var Docxtemplater = require('docxtemplater')
import express from 'express'
import formidable from 'formidable'
import fs from 'fs'
const tmp = require('tmp')
const libre = require('libreoffice-convert')
var InspectModule = require("docxtemplater/js/inspect-module")
var PizZip = require('pizzip')
import stream from 'stream'



import { getConnection } from 'typeorm'

import { asyncMiddleware, isAuthenticated, permitPermission,
  permitCustodianBasedPermission } from '../utils'
import { SurveyRequest } from '../../lib/entity/survey-request'
import { SurveyPlan } from '../../lib/entity/survey-plan'
import { reportGeneratorFactory } from '../../lib/report-generator'
import { ReportTemplate, REPORT_TEMPLATE_TYPES }
  from '../../lib/entity/report-template'

const router = express.Router()


// one entry for each REPORT_TEMPLATE_TYPES in the entity/report-template.js
// relationships is used to build query to get entity and related info
// custodian attributes are used for the authorisation middleware check
const TEMPLATE_TYPE_MAP = {
  'HIPP Request': {
    entityType: SurveyRequest,
    allowedPermissionAll: 'canViewAllSurveyRequests',
    allowedPermissionCustodian: 'canViewCustodianSurveyRequests',
    custodianAttributes: ['custodians'],
  },
  'Plan': {
    entityType: SurveyPlan,
    allowedPermissionAll: 'canViewAllSurveyPlans',
    allowedPermissionCustodian: 'canViewCustodianSurveyPlans',
    custodianAttributes: ['custodians'],
  },
}

function writeData(res, reportData, reportGen, reportTemplate) {
  // callback function that get called by the report generator when done
  const readStream = new stream.PassThrough()
  readStream.end(reportData)
  res.set(
    'Content-disposition',
    `attachment; filename=${reportGen.getFilename()}.docx`)
  res.set('Content-length', reportData.length)
  res.set('Content-Type', reportTemplate.mimeType)
  readStream.pipe(res)
}


function writePdfData(res, reportData, reportGen, reportTemplate) {
  // callback function that get called by the report generator when done
  const pdf_filename = `${reportGen.getFilename()}.pdf`

  libre.convert(reportData, '.pdf', undefined, (err, done) => {
      if (err) {
        console.log(`Error converting file: ${err}`);
      }

      const readStream = new stream.PassThrough()
      readStream.end(done)
      res.set(
        'Content-disposition',
        `attachment; filename=${pdf_filename}`)
      res.set('Content-length', done.length)
      res.set('Content-Type', 'application/pdf')
      readStream.pipe(res)
  });
}


function reportGenPermit() {
  return permitCustodianBasedPermission({
    overrideFlag:'public',
    entityTypeFn:(request) => {
      return TEMPLATE_TYPE_MAP[request.params.templateType].entityType
    },
    custodianAttributesFn:(request) => {
      return TEMPLATE_TYPE_MAP[request.params.templateType].custodianAttributes
    },
    allowedPermissionAllFn:(request) => {
      return TEMPLATE_TYPE_MAP[request.params.templateType].allowedPermissionAll
    },
    allowedPermissionCustodianFn:(request) => {
      return TEMPLATE_TYPE_MAP[request.params.templateType].allowedPermissionCustodian
    },
  })
}

// Gets a list of custodians
router.get(
  '/generate/:templateType/:id',
  [isAuthenticated, reportGenPermit()],
  asyncMiddleware(async function (req, res) {

  const entityId = req.params.id;
  const templateType = req.params.templateType;
  const format = _.isNil(req.query['format']) ?
    'pdf' :
    req.query['format']

  if (!(format == 'docx' || format == 'csv' || format == 'pdf')) {
    let err = Boom.badRequest(
      `format must be 'docx', 'pdf', or 'csv' not '${format}'`)
    throw err
  }

  if (_.isNil(entityId) || _.isNil(templateType)) {
    let err = Boom.badRequest(`entityId and templateType must be specified ` +
      `(eg; /generate/:templateType/:entityId)`)
    throw err
  }

  if (!(templateType in TEMPLATE_TYPE_MAP)) {
    let err = Boom.badRequest(`Template type ${templateType} is not defined`)
    throw err
  }

  const templateDetails = TEMPLATE_TYPE_MAP[templateType]

  const reportGen = await reportGeneratorFactory(templateType, entityId)

  if (format == 'docx') {
    reportGen.generate(writeData, res)
  } else if (format == 'pdf') {
    reportGen.generate(writePdfData, res)
  } else {
    const csv = reportGen.getCsvData()

    res.set(
      'Content-disposition',
      `attachment; filename=${reportGen.getFilename()}.csv`)
    res.set('Content-length', csv.length)
    res.set('Content-Type', 'text/csv')
    res.send(csv)
  }

}));


// Gets a list of report templates
router.get(
  '/',
  [isAuthenticated, permitPermission('isAdmin')],
  asyncMiddleware(async function (req, res) {

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
  [isAuthenticated, permitPermission('isAdmin')],
  asyncMiddleware(async function (req, res) {

    const id = req.params.id;

    if (_.isNil(id) || id.length == 0) {
      let err = Boom.notFound(`Must template id ` +
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
      let err = Boom.notFound(`Report template with id ${id} does not exist`);
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
      let err = Boom.notImplemented(
        `ReportTemplate in s3 not implemented yet`);
      throw err;
    } else {
      let err = Boom.badImplementation(
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

function validateData(data, reportTemplate) {
  var zip = new PizZip(data)

  var doc = new Docxtemplater()
  doc.loadZip(zip)
  var iModule = InspectModule()
  doc.attachModule(iModule)
  try {
    doc.render()
    var tags = iModule.getAllTags()
    reportTemplate.parameters = tags
    reportTemplate.valid = true
  }
  catch (error) {
    var e = {
        message: error.message,
        name: error.name,
        stack: error.stack,
        properties: error.properties,
    }
    reportTemplate.errors = e
    reportTemplate.valid = false
  }
}

//upload for a new template, form includes fields that are needed by DB
router.put(
  '/upload',
  [isAuthenticated, permitPermission('canEditTemplate')],
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
    const data = fs.readFileSync(file.path)
    validateData(data, rt)
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
