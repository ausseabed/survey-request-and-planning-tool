import _ from 'lodash'
const boom = require('boom')
var Docxtemplater = require('docxtemplater')
var InspectModule = require("docxtemplater/js/inspect-module")
var JSZip = require('jszip')
var moment = require('moment')

export class ReportGenerator {
  constructor(entity, reportTemplate) {
    this.entity = entity
    this.reportTemplate = reportTemplate
  }

  getFilename() {
    // returns a filename that is used in the reponse header. It's what the
    // downloaded file will be named.
    let fn = `${this.reportTemplate.templateType}.docx`
    fn = fn.replace(' ', '-')
    return fn
  }

  getData() {
    // return a dict containing the parameters that are substituted into
    // the template
    let err = boom.notImplemented(
      `ReportGenerator.getData needs to be overwritten by child class`);
    throw err;
  }

  getTemplate() {
    // gets the data from the report template. Currently only support DB
    // storage (not s3), but the idea is that here is where the data would
    // be retreived from s3.
    if (this.reportTemplate.storage == 'db') {
      return this.reportTemplate.blob
    } else if (surveyFile.storage == 's3') {
      let err = boom.notImplemented(
        `ReportTemplate in s3 not implemented yet`);
      throw err;
    } else {
      let err = boom.badImplementation(
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

  getDateString(value, formatString) {
    // converts datetime stored in database but retreived as a int by the
    // DateTransformer back into a date. Then converts from UTC to Melbourne
    // time.
    // Melbourne's UTC offset is +10
    if (_.isNil(value)) {
      return undefined
    }
    return moment(value).utcOffset(10).format(formatString)
  }

  generate() {
    // performs the substitution of the entity values into teh report template
    var zip = new JSZip(this.getTemplate())

    var doc = new Docxtemplater()
    doc.loadZip(zip)

    const params = this.getData()
    doc.setData(params)

    try {
      doc.render()
    }
    catch (error) {
      var e = {
          message: error.message,
          name: error.name,
          stack: error.stack,
          properties: error.properties,
      }
      throw error
    }

    var buf = doc.getZip().generate({type: 'nodebuffer'})
    return buf
  }
}


export class HippRequestReportGenerator extends ReportGenerator {

  constructor (entity, reportTemplate) {
    super(entity, reportTemplate)
  }

  getFilename() {
    // returns a filename that is used in the reponse header. It's what the
    // downloaded file will be named.
    let fn = `${this.reportTemplate.templateType} ${this.entity.name}.docx`
    fn = fn.replace(' ', '-')
    return fn
  }

  getData () {
    // do a mapping from the entity attribute names and values to the names
    // and values that will be passed into the document template.
    const data = {
      id: this.entityAttributeValue('id'),
      name: this.entityAttributeValue('name'),
      requestingAgency: this.entityAttributeValue('requestingAgency'),
      requestorName: this.entityAttributeValue('requestorName'),
      pointOfContactEmail: this.entityAttributeValue('pointOfContactEmail'),
      pointOfContactPhone: this.entityAttributeValue('pointOfContactPhone'),
      requestDate:
        this.getDateString(
          this.entityAttributeValue('requestDate'),
          'DD/MM/YYYY'),
      requestDateLong:
        this.getDateString(
          this.entityAttributeValue('requestDate'),
          'MMMM Do YYYY'),
      areaName: this.entityAttributeValue('areaName'),
      areaValue: this.entityAttributeValue('area'),
      businessJustification: this.entityAttributeValue('businessJustification'),
      costBenefit: this.entityAttributeValue('costBenefit'),
      hasMoratorium: this.entityAttributeValue('hasMoratorium'),
      comments: this.entityAttributeValue('comments'),
      surveyQualityRequirements:
        this.entityAttributeValue('surveyQualityRequirements'),
      surveyQualityRequirementsComments:
        this.entityAttributeValue('surveyQualityRequirementsComments'),
      chartProductQualityImpactRequirements:
        this.entityAttributeValue('chartProductQualityImpactRequirements'),
      riskIssues: this.entityAttributeValue('riskIssues'),
      attachments: this.entityAttributeValue('attachments'),
    }
    return data
  }

}
