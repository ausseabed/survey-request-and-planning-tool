import _ from 'lodash'
var Axios = require('axios')
var expressions= require('angular-expressions')
import * as Boom from '@hapi/boom';
var Docxtemplater = require('docxtemplater')
import { getConnection } from 'typeorm';
var ImageModule = require('@slosarek/docxtemplater-image-module-free')
var InspectModule = require("docxtemplater/js/inspect-module")
var PizZip = require('pizzip')
var moment = require('moment')
const { Parser } = require('json2csv')

import * as ReferenceSystems from './reference-system'
import { SurveyRequest } from './entity/survey-request'
import { SurveyPlan } from './entity/survey-plan'
import { ReportTemplate } from './entity/report-template'


// similar to TEMPLATE_TYPE_MAP found in the report-template.js request
// handler, but here we define some other information that is needed to gather
// the information related to a specific entity required for report generation
const TEMPLATE_ENTITY_DEPENDENCIES_MAP = {
  'HIPP Request': {
    entityType: SurveyRequest,
    relations: [
      'custodians',
      'organisation',
      'organisations',
      'aois',
      'recordState',
    ],
    additionalSelects: [
      'aois.thumbnail'
    ]
  },
  'Plan': {
    entityType: SurveyPlan,
    relations: [
      'custodians',
      'dataCaptureTypes',
      'instrumentTypes',
      'surveyApplication',
      'attachments',
      'attachments.attachment',
      'deliverables',
      'surveyRequest',
      'recordState',
      'techSpec',
    ],
  },
}


export async function reportGeneratorFactory(templateType, entityId) {
  const entityDeps = TEMPLATE_ENTITY_DEPENDENCIES_MAP[templateType]
  const entityRepo = getConnection()
  .getRepository(entityDeps.entityType)

  // here we build a rather complex query instead of a simple typeorm .findOne
  // call. Reason for this is that all the needed columns are not necessarily
  // included in findOne results as some columns are defined as being selected
  // as default. Main example here being the thumbnail images saved in
  // the database; we embed these in the report but generally they are not
  // needed and should not automatically be selected.
  const columns = getConnection()
  .getMetadata(entityDeps.entityType)
  .ownColumns
  .map(column => entityDeps.entityType.name + '.' + column.propertyName)

  let q = await entityRepo
  .createQueryBuilder()
  .select(columns)
  .where(`"${entityDeps.entityType.name}".id = :id`, { id: entityId })

  for (const relation of entityDeps.relations) {
    q = q.leftJoinAndSelect(
      entityDeps.entityType.name + '.' + relation,
      relation
    )
  }

  for (const additionalSelect of entityDeps.additionalSelects) {
    q = q.addSelect(additionalSelect)
  }

  // and finally we get the entity (survey plan or request) with all the
  // relations and selects defined in TEMPLATE_ENTITY_DEPENDENCIES_MAP
  let entity = await q.getOne()

  if (_.isNil(entity) || entity.deleted) {
    let err = Boom.notFound(
      `Entity ${entityDeps.entityType} ${entityId} does not exist`);
    throw err;
  }

  // get the active report template for this type, making sure to select the
  // attribs needed.
  const reportTemplate = await getConnection().getRepository(ReportTemplate)
  .createQueryBuilder("report_template")
  .select([
    "report_template.id",
    "report_template.templateType",
    "report_template.fileName",
    "report_template.active",
    "report_template.mimeType",
    "report_template.storage",
    "report_template.blob"
  ])
  .where(
    `"templateType" = :templateType`,
    {templateType: templateType}
  ).andWhere(
    `"active" = :active`,
    {active: true}
  )
  .getOne();

  if (templateType == 'HIPP Request') {
    return new HippRequestReportGenerator(
      entity, entityDeps.entityType, reportTemplate)
  } else if (templateType == 'Plan') {
    return new SurveyPlanReportGenerator(
      entity, entityDeps.entityType, reportTemplate)
  }
  else {
    // we check this earlier so shouldn't end up here
    let err = Boom.notFound(
      `Unknown template type ${templateType}`);
    throw err;
  }
}


expressions.filters.lower = function(input) {
  // This condition should be used to make sure that if your input is undefined, your output will be undefined as well and will not throw an error
  if(!input) return input;
  return input.toLowerCase();
}

expressions.filters.formatNumber = function(input) {
    // In our example precision is the integer 2
    // This condition should be used to make sure that if your input is
    // undefined, your output will be undefined as well and will not
    // throw an error
    if(!input) return input;
    return new Intl.NumberFormat(
      undefined,
      {maximumFractionDigits:1}
    )
    .format(input)
}

function getDateString(value, formatString) {
  // converts datetime stored in database but retreived as a int by the
  // DateTransformer back into a date. Then converts from UTC to Melbourne
  // time.
  // Melbourne's UTC offset is +10
  if (_.isNil(value)) {
    return undefined
  }
  return moment(value).utcOffset(10).format(formatString)
}

expressions.filters.formatDate = function(input) {
  if(!input) return input;
  return getDateString(input, 'DD-MM-YYYY')
}

export class ReportGenerator {
  constructor(entity, entityType, reportTemplate) {
    this.entity = entity
    this.entityType = entityType
    this.reportTemplate = reportTemplate
    this.imageSize = 800
  }

  getFilename() {
    // returns a filename that is used in the reponse header. It's what the
    // downloaded file will be named. Do not include extension here.
    let fn = `${this.reportTemplate.templateType}`
    fn = fn.replace(' ', '-')
    return fn
  }

  getData() {
    // return a dict containing the parameters that are substituted into
    // the template
    let err = Boom.notImplemented(
      `ReportGenerator.getData needs to be overwritten by child class`);
    throw err;
  }

  getRawDataFields() {
    // returns a list of the fields that will be exported to the raw output
    // these must match the keys returned by getData
    return []
  }

  mergeRecordState(data) {
    if (_.has(this.entity, 'recordState')) {
      if (_.isNil(this.entity.recordState)) {
        data['recordState'] = {
          'state': 'draft',
          'version': 0,
        }
      } else {
        data['recordState'] = this.entity.recordState
      }
    }
  }

  getTemplate() {
    // gets the data from the report template. Currently only support DB
    // storage (not s3), but the idea is that here is where the data would
    // be retreived from s3.
    if (this.reportTemplate.storage == 'db') {
      return this.reportTemplate.blob
    } else if (surveyFile.storage == 's3') {
      let err = Boom.notImplemented(
        `ReportTemplate in s3 not implemented yet`);
      throw err;
    } else {
      let err = Boom.badImplementation(
        `ReportTemplate.storage should always be db or s3`);
      throw err;
    }
  }

  entityAttributeValue(attribName) {
    if (attribName in this.entity) {
      return this.entity[attribName]
    } else {
      return undefined
    }
  }

  flattenObject(ob, excludeList) {
    var toReturn = {};

    for (var i in ob) {
      if (!ob.hasOwnProperty(i)) continue;
      if (excludeList.includes(i)) continue;

      if ((typeof ob[i]) == 'object' && ob[i] !== null) {
        var flatObject = this.flattenObject(ob[i], excludeList);
        for (var x in flatObject) {
            if (!flatObject.hasOwnProperty(x)) continue;

            toReturn[i + '.' + x] = flatObject[x];
        }
      } else {
        toReturn[i] = ob[i];
      }
    }
    return toReturn;
  }

  namesDict(entity, excludeList) {
    const res = {}
    for (const [key, value] of Object.entries(entity)) {
      if (excludeList.includes(key)) continue;
      res[key] = value;
    }
    return res;
  }

  generate(writeData, res) {
    // performs the substitution of the entity values into the report template

    var imgOpts = {}
    imgOpts.centered = false; //Set to true to always center images
    imgOpts.fileType = "docx"; //Or pptx
    imgOpts.getImage =  (tagValue, tagName) => {
      return new Promise(async (resolve, reject) => { // <--- this line
        try {
          return resolve(tagValue);
        } catch(error) {
          return reject(error);
        }
      })
    }
    imgOpts.getSize = function(img, tagValue, tagName) {
      let size = [300, 300]
      return size
    }
    var imageModule = new ImageModule(imgOpts)

    var zip = new PizZip(this.getTemplate())

    var angularParser = function(tag) {
      return {
        get: tag === '.' ? function(s){ return s;} : function(s) {
          return expressions.compile(tag.replace(/(’|“|”)/g, "'"))(s)
        }
      }
    }

    var doc = new Docxtemplater()
    .loadZip(zip)
    .setOptions(
      {
        parser:angularParser,
        linebreaks: true
      }
    )
    .attachModule(imageModule)
    .compile()

    const params = this.getData()

    doc.resolveData(params)
    .then(() => {
      doc.render()

      var buf = doc.getZip().generate({type: 'nodebuffer'})
      // return buf
      writeData(res, buf, this, this.reportTemplate)
    })
    .catch((err) => {
      res
      .status(500)
      .json(err)
      console.error(err)
    })
  }

  getCsvData() {
    // uses json2csv to convert data object into csv string
    const entityData = this.getData()
    const fields = this.getRawDataFields(entityData)
    // following tweaks to the newline char were tested on excel for macOS,
    // this may / may not work on windows
    const json2csvParser = new Parser({
      fields,
      eol: '\r\n'
    })

    for (const [key, value] of Object.entries(entityData)) {
      if (typeof value === 'string' || value instanceof String) {
        entityData[key] = value.replace(/\n/g, '\r\n')
      }
    }
    // needs an array of data
    const csvData = json2csvParser.parse([entityData])
    return csvData
  }
}


export class HippRequestReportGenerator extends ReportGenerator {

  constructor (entity, entityType, reportTemplate) {
    super(entity, entityType, reportTemplate)
  }

  getFilename() {
    // returns a filename that is used in the reponse header. It's what the
    // downloaded file will be named. Do not include extension here.
    let fn = `${this.reportTemplate.templateType} ${this.entity.name}`
    fn = fn.replace(' ', '-')
    return fn
  }

  getData () {
    // do a mapping from the entity attribute names and values to the names
    // and values that will be passed into the document template.
    const data = {
      id: this.entityAttributeValue('id'),
      name: this.entityAttributeValue('name'),
      custodians: this.entityAttributeValue('custodians'),
      organisation: this.entityAttributeValue('organisation'),
      organisations: this.entityAttributeValue('organisations'),
      requestorName: this.entityAttributeValue('requestorName'),
      requestorPosition: this.entityAttributeValue('requestorPosition'),
      pointOfContactEmail: this.entityAttributeValue('pointOfContactEmail'),
      businessJustification: this.entityAttributeValue('businessJustification'),
      costBenefit: this.entityAttributeValue('costBenefit'),
      riskIssues: this.entityAttributeValue('riskIssues'),
      furtherInformation: this.entityAttributeValue('furtherInformation'),
      costBenefit: this.entityAttributeValue('costBenefit'),
      additionalFundingAvailable: this.entityAttributeValue('additionalFundingAvailable'),
      areasOfInterest: this.entityAttributeValue('aois'),
    }

    this.mergeRecordState(data)

    return data
  }

  getRawDataFields(entityData) {
    let rawFields = [
      'id',
      'name',
      'custodians.name',
      'organisation.name',
      'organisations.name',
      'organisations.abn',
      'requestorName',
      'requestorPosition',
      'pointOfContactEmail',
      'businessJustification',
      'costBenefit',
      'recordState.state',
      'recordState.version',
    ]
    return rawFields
  }

}


export class SurveyPlanReportGenerator extends ReportGenerator {

  constructor (entity, entityType, reportTemplate) {
    super(entity, entityType, reportTemplate)
  }

  getFilename() {
    // returns a filename that is used in the reponse header. It's what the
    // downloaded file will be named. Do not include extension here.
    let fn = `${this.reportTemplate.templateType} ${this.entity.surveyName}`
    fn = fn.replace(' ', '-')
    return fn
  }

  getReferenceSystemName(referenceSystems, crsId) {
    if (_.isNil(crsId)) {
      return undefined
    }

    // find based on a string comparision, because we're not sure what may
    // be passed in.
    const crsIdStr = crsId.toString()
    const matchingCrs = referenceSystems.find((crs) => {
      return crsIdStr == crs.value.toString()
    })

    return matchingCrs ? matchingCrs.label : crsId;
  }

  getData () {

    const data = this.namesDict(this.entity, [
      'areaOfInterest', 'startDate', 'techSpec']);

    data['name'] = this.entityAttributeValue('surveyName');
    data['hasTechSpec'] = !_.isNil(this.entity.techSpec);
    if (data['hasTechSpec']) {
      const techSpec = this.entity.techSpec;
      data['techSpec'] = this.namesDict(
        techSpec,
        ['surveyLines','tidalGaugeLocations']
      );
      data['techSpec']['hasSurveyLines'] = !_.isNil(this.entity.surveyLines);
      this.mergeImageKeys('surveyLines', data['techSpec']);

      // replace reference system ids with their names
      data['techSpec']['horizontalReferenceSystem'] =
        this.getReferenceSystemName(
          ReferenceSystems.HORIZONTAL_REFERENCE_SYSTEMS,
          techSpec.horizontalReferenceSystem
        )
      data['techSpec']['verticalReferenceSystem'] =
        this.getReferenceSystemName(
          ReferenceSystems.VERTICAL_REFERENCE_SYSTEMS,
          techSpec.verticalReferenceSystem
        )
      data['techSpec']['soundingDatum'] =
        this.getReferenceSystemName(
          ReferenceSystems.VERTICAL_REFERENCE_SYSTEMS,
          techSpec.soundingDatum
        )
      data['techSpec']['spheroid'] =
        this.getReferenceSystemName(
          ReferenceSystems.VERTICAL_REFERENCE_SYSTEMS,
          techSpec.spheroid
        )

    } else {
      data['techSpec'] = undefined;
    }

    data['hasAreaOfInterest'] = !_.isNil(this.entity.areaOfInterest);
    this.mergeImageKeys('area_of_interest', data);
    this.mergeRecordState(data);

    return data
  }

  getRawDataFields(entityData) {
    const flatData = this.flattenObject(
      entityData,
      ['defaults', 'id', 'recordId', 'surveyPlans']
    );

    const flatDataArray = [];
    flatDataArray.push('id');
    for (const [key, value] of Object.entries(flatData)) {
      flatDataArray.push(key)
    }

    return flatDataArray
  }

}
