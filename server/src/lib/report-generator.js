import _ from 'lodash'
var Axios = require('axios')
var expressions= require('angular-expressions')
import * as Boom from '@hapi/boom';
var Docxtemplater = require('docxtemplater')
import { getConnection } from 'typeorm';
var ImageModule = require('docxtemplater-image-module-free')
var InspectModule = require("docxtemplater/js/inspect-module")
var PizZip = require('pizzip')
var moment = require('moment')
const { Parser } = require('json2csv')
var sharp = require('sharp')

import * as ReferenceSystems from './reference-system'

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

  mergeImageKeys(attrName, data) {
    // adds all the tags for the various image sizes the user can include
    // in the template
    data[`${attrName}`] = attrName
    data[`${attrName}_sm`] = attrName
    data[`${attrName}_md`] = attrName
    data[`${attrName}_lg`] = attrName
    data[`${attrName}_xl`] = attrName
    data[`${attrName}_small`] = attrName
    data[`${attrName}_medium`] = attrName
    data[`${attrName}_large`] = attrName
    data[`${attrName}_extralarge`] = attrName
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

  async getDbImage_old(attrName) {
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

  async getExtents(attrName) {
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
    maxDelta = maxDelta * 1.3 // 30% buffer around regions bounding box
    let newExtents = {
      minX: center.x - maxDelta/2,
      maxX: center.x + maxDelta/2,
      minY: center.y - maxDelta/2,
      maxY: center.y + maxDelta/2,
    }
    return newExtents
  }

  async getDbImage(attrName, extents) {

    let entityMd = getConnection().getMetadata(this.entityType)
    let tableName = entityMd.tableName

    let rasterSize = this.imageSize
    const dX = extents.maxX - extents.minX
    const dY = extents.maxY - extents.minY
    const maxDelta = dX > dY ? dX : dY
    let scale = maxDelta / rasterSize
    let bufferWidth = maxDelta / 350.0


    let nrq = `ST_MakeEmptyRaster(${rasterSize},${rasterSize},${extents.minX}, ${extents.maxY}, ${scale}, ${-1*scale}, 0,0,4326)`
    let aoiRaster = `ST_AsRaster("${attrName}",${nrq},ARRAY[\'8BUI\', \'8BUI\', \'8BUI\', \'8BUI\'], ARRAY[255, 0, 0, 55], ARRAY[255,255,255, 0])`
    let aoiRasterBoundary = `ST_AsRaster(ST_Buffer(ST_Boundary("${attrName}"), ${bufferWidth},\'join=round\'),${nrq},ARRAY[\'8BUI\', \'8BUI\', \'8BUI\', \'8BUI\'], ARRAY[255, 0, 0, 255], ARRAY[255,255,255, 0])`

    const innSel = `SELECT ${aoiRasterBoundary} as rast from ${tableName} where "id" = '${this.entity.id}' UNION ALL SELECT ${aoiRaster} as rast from ${tableName} where "id" = '${this.entity.id}' UNION ALL SELECT ${nrq}`;

    const mergedRaster = await getConnection()
    .query(`select ST_AsPNG(ST_Union(rast, 'FIRST')) "imageData" from (${innSel}) foo`)

    return mergedRaster[0].imageData
  }

  async getBaseMapImage(extents) {
    const sizeX = this.imageSize
    const sizeY = this.imageSize
    const wmsBase = `http://gaservices.ga.gov.au/site_7/rest/services/NationalMap_Colour_Topographic_Base_World_WM/MapServer/export`
    const wmsBB = `BBOX=${extents.minX}%2C${extents.minY}%2C${extents.maxX}%2C${extents.maxY}`
    const baseMapUrl = `${wmsBase}?F=image&FORMAT=PNG32&TRANSPARENT=true&SIZE=${sizeX}%2C${sizeY}&${wmsBB}&BBOXSR=4326&IMAGESR=4326&DPI=180`
    try {
      let res = await Axios.get(baseMapUrl, {responseType: 'arraybuffer'})
      return res.data
    } catch(error) {
      console.log(error)
      const noBaseMapImg =
        await sharp('src/lib/report-generator-nobasemap.png')
        .resize(sizeX, sizeY)
        .png()
        .toBuffer()
      return noBaseMapImg
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
      hasMoratorium: this.entityAttributeValue('hasMoratorium'),
      moratoriumDate:
        this.getDateString(
          this.entityAttributeValue('moratoriumDate'),
          'DD/MM/YYYY'),
      moratoriumComment: this.entityAttributeValue('moratoriumComment'),
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
      'hasMoratorium',
      'moratoriumDate',
      'moratoriumComment',
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
      'areaOfInterest', 'startDate', 'moratoriumDate', 'techSpec']);

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
