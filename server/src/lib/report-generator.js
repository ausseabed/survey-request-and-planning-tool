import _ from 'lodash'
var Axios = require('axios')
var expressions= require('angular-expressions')
const boom = require('boom')
var Docxtemplater = require('docxtemplater')
import { getConnection } from 'typeorm';
var ImageModule = require('docxtemplater-image-module-free')
var InspectModule = require("docxtemplater/js/inspect-module")
var JSZip = require('jszip')
var moment = require('moment')
var sharp = require('sharp')


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
    this.imageSize = 800
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
    // performs the substitution of the entity values into the report template

    var imgOpts = {}
    imgOpts.centered = false; //Set to true to always center images
    imgOpts.fileType = "docx"; //Or pptx
    imgOpts.getImage =  (tagValue, tagName) => {
      return new Promise(async (resolve, reject) => { // <--- this line
        try {
          const attrName = tagValue
          if (_.isNil(this.entity[attrName])) {
            console.log("no region" )
            const noRegionImg =
              await sharp('src/lib/report-generator-noregion.png')
              .png()
              .toBuffer()
            return resolve(noRegionImg);
          }
          const extents = await this.getExtents(attrName)
          const dbImg = await this.getDbImage(attrName, extents)
          const bmImg = await this.getBaseMapImage(extents)

          const mergedImg = await sharp(bmImg)
          .modulate({saturation: 0.7})
          .composite([{ input: dbImg}])
          .png()
          .toBuffer()

          return resolve(mergedImg);
        } catch(error) {
          return reject(error);
        }
      })
    }
    imgOpts.getSize = function(img, tagValue, tagName) {
      //tagValue is what is included in word doc template
      //tagName is the value in the data dict
      const tagValueBits = tagName.split('_')
      let sizeStr = 'md'
      if (tagValueBits.length > 1) {
        sizeStr = tagValueBits[1].toLowerCase()
      }
      let size = [400, 400]
      if (sizeStr == 'sm' || sizeStr == 'small') {
        size = [200, 200]
      } else if (sizeStr == 'md' || sizeStr == 'medium') {
        size = [400, 400]
      } else if (sizeStr == 'lg' || sizeStr == 'large') {
        size = [800, 800]
      } else if (sizeStr == 'xl' || sizeStr == 'extralarge') {
        size = [1000, 1000]
      }
      return size
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
      chartProductQualityImpactRequirementsComments:
        this.entityAttributeValue('chartProductQualityImpactRequirementsComments'),
      riskIssues: this.entityAttributeValue('riskIssues'),
      attachments: this.entityAttributeValue('attachments'),
      hasAreaOfInterest: !_.isNil(this.entity.areaOfInterest),
    }

    this.mergeImageKeys('areaOfInterest', data)

    return data
  }

}
