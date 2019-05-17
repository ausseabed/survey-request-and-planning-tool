import _ from 'lodash'
var expressions= require('angular-expressions')
const boom = require('boom')
var Docxtemplater = require('docxtemplater')
import { getConnection } from 'typeorm';
var ImageModule = require('docxtemplater-image-module-free')
var InspectModule = require("docxtemplater/js/inspect-module")
var JSZip = require('jszip')
var moment = require('moment')


expressions.filters.lower = function(input) {
  // This condition should be used to make sure that if your input is undefined, your output will be undefined as well and will not throw an error
  if(!input) return input;
  return input.toLowerCase();
}


export class ReportGenerator {
  constructor(entity, entityType, reportTemplate) {
    this.entity = entity
    this.entityType = entityType
    this.reportTemplate = reportTemplate
    this.imageSize = 400
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

  async getDbImage(attrName) {
    const extents = await getConnection()
    .createQueryBuilder()
    .select([`ST_XMin("extent")`, `ST_XMax("extent")`, `ST_YMin("extent")`, `ST_YMax("extent")`])
    .from(subQuery => {
      return subQuery
        .select(`ST_Extent("${attrName}")`, 'extent')
        .from(this.entityType)
        .where(`"id" = :id`, { id: this.entity.id });
    }, "extent")
    .getRawOne();

    let center = {
      x: (extents.st_xmax + extents.st_xmin)/2,
      y: (extents.st_ymax + extents.st_ymin)/2
    }
    let dX = extents.st_xmax - extents.st_xmin
    let dY = extents.st_ymax - extents.st_ymin
    let maxDelta = dX > dY ? dX : dY
    let newExtents = {
      minX: center.x - maxDelta/2,
      maxX: center.x + maxDelta/2,
      minY: center.y - maxDelta/2,
      maxY: center.y + maxDelta/2,
    }

    let rasterSize = this.imageSize
    let scale = maxDelta / rasterSize

    let nrq = `ST_MakeEmptyRaster(${rasterSize},${rasterSize},${newExtents.minX}, ${newExtents.maxY}, ${scale}, ${-1*scale}, 0,0,4326)`

    let dbImage = await getConnection()
    .getRepository(this.entityType)
    .createQueryBuilder()
    .select(`ST_AsPNG(ST_AsRaster("${attrName}",${nrq},ARRAY[\'8BUI\', \'8BUI\', \'8BUI\'], ARRAY[97, 173, 216], ARRAY[255,255,255]))`, 'imageData')
    .where(`"id" = :id`, {id: this.entity.id})
    .getRawOne();

    return dbImage.imageData
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

  generate(writeData, res) {
    // performs the substitution of the entity values into teh report template

    var imgOpts = {}
    imgOpts.centered = false; //Set to true to always center images
    imgOpts.fileType = "docx"; //Or pptx
    imgOpts.getImage =  (tagValue, tagName) => {
      return new Promise(async (resolve, reject) => { // <--- this line
        try {
          const img = await this.getDbImage(tagValue)
          return resolve(img);
        } catch(error) {
          return reject(error);
        }
      })
    }
    imgOpts.getSize = function(img, tagValue, tagName) {
      //img is the image returned by opts.getImage()
      //tagValue is 'examples/image.png'
      //tagName is 'image'
      //tip: you can use node module 'image-size' here
      return [150, 150]
    }
    var imageModule = new ImageModule(imgOpts)

    var zip = new JSZip(this.getTemplate())

    var angularParser = function(tag) {
      return {
        get: tag === '.' ? function(s){ return s;} : function(s) {
          return expressions.compile(tag.replace(/(’|“|”)/g, "'"))(s)
        }
      }
    }

    var doc = new Docxtemplater()
    .loadZip(zip)
    .setOptions({parser:angularParser})
    .attachModule(imageModule)
    .compile()

    const params = this.getData()

    doc.resolveData(params).then(() =>  {
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
      // return buf
      writeData(res, buf, this, this.reportTemplate)
    })

  }
}


export class HippRequestReportGenerator extends ReportGenerator {

  constructor (entity, entityType, reportTemplate) {
    super(entity, entityType, reportTemplate)
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
      areaOfInterest: 'areaOfInterest',
    }



    return data
  }

}
