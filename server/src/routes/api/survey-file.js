var express = require('express');
const formidable = require('formidable')
const fs = require('fs');
const stream = require('stream');
var _ = require('lodash');
const boom = require('boom');

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated, geojsonToMultiPolygon,
  geojsonToMultiLineString, geojsonToMultiPoint, isUuid }
  from '../utils';
import { ProjectMetadata } from '../../lib/entity/project-metadata';
import { SurveyFile } from '../../lib/entity/survey-file';


var router = express.Router();

router.delete('/:id/delete/:fileId', isAuthenticated,
  asyncMiddleware(async function(req, res){

  const id = req.params.id;
  const fileId = req.params.fileId;

  if (!id || !fileId) {
    let err = boom.notFound(
      `Must provide project id and file id (eg; /:id/delete/:fileId)`);
    throw err;
  }

  await getConnection()
  .getRepository(SurveyFile)
  .delete(fileId);

  res.end();
}));

router.get('/:id/download/:name', isAuthenticated,
  asyncMiddleware(async function(req, res){

  const id = req.params.id;
  const fileName = req.params.name;

  if (!id || !fileName) {
    let err = boom.notFound(
      `Must provide project id and file name (eg; /:id/download/:name)`);
    throw err;
  }

  let surveyFile = undefined;

  // support giving the unique survey file UUID for downloads. otherwise
  // there is no way to download a specific file that shares the same name as
  // another file in this project.
  if (isUuid(fileName)) {
    surveyFile = await getConnection()
    .getRepository(SurveyFile)
    .createQueryBuilder("survey_file")
    .select(["survey_file.fileName", "survey_file.storage", "survey_file.blob"])
    .where(
      `"projectMetadataId" = :id`,
      {id: id}
    ).andWhere(
      `"id" = :fileName`,
      {fileName: fileName}
    )
    .getOne();
  } else {
    surveyFile = await getConnection()
    .getRepository(SurveyFile)
    .createQueryBuilder("survey_file")
    .select(["survey_file.fileName", "survey_file.storage", "survey_file.blob"])
    .where(
      `"projectMetadataId" = :id`,
      {id: id}
    ).andWhere(
      `"fileName" = :fileName`,
      {fileName: fileName}
    )
    .getOne();
  }

  let data = undefined;
  if (surveyFile.storage == 'db') {
    data = surveyFile.blob;

    const readStream = new stream.PassThrough();
    readStream.end(data);
    res.set(
      'Content-disposition', 'attachment; filename=' + surveyFile.fileName);
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


router.get('/:id', /*isAuthenticated,*/
  asyncMiddleware(async function(req, res){
  // gets a  list of survey files for the given project id
  const id = req.params.id;

  // only select the columns needed. Should avoid getting the blob column here
  // as it may be large.
  let surveyFiles = await getConnection()
  .getRepository(SurveyFile)
  .createQueryBuilder("survey_file")
  .where(
    `"projectMetadataId" = :id`,
    {id: id}
  )
  .orderBy("survey_file.fileName")
  .getMany();

  return res.json(surveyFiles);
}));


async function saveFile(file, projectMetadata) {
  let surveyFile = new SurveyFile();
  surveyFile.projectMetadata = projectMetadata;
  surveyFile.fileName = file.name;
  // UTC milliseconds (converted to date by TypeORM transformer)
  surveyFile.created = Date.now();

  console.log(surveyFile);


  const storage = "db";
  surveyFile.storage = storage;

  const data = fs.readFileSync(file.path);
  surveyFile.blob = data;

  surveyFile = await getConnection()
  .getRepository(SurveyFile)
  .save(surveyFile);

  return surveyFile;
}


router.put('/:id/upload', isAuthenticated,
  asyncMiddleware(async function (req, res) {

  const id = req.params.id;

  // check project exists with this id,
  const projMetaRepo = getConnection().getRepository(ProjectMetadata);
  let project = await projMetaRepo.findOne(req.params.id);
  if (!project) {
    let err = boom.notFound(
      `ProjectMetadata ${id} does not exist, cannot save file`);
    throw err;
  }

  new formidable.IncomingForm().parse(req)
  .on('field', (name, field) => {
    console.log('Field', name, field)
  })
  .on('file', (name, file) => {
    saveFile(file, project);
  })
  .on('aborted', () => {
    console.error('Request aborted by the user')
  })
  .on('error', (err) => {
    console.error('Error', err)
    throw err
  })
  .on('end', () => {
    res.end()
  })
}));


module.exports = router;
