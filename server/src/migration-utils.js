const _ = require('lodash');

import { DeliverableDefinition, DeliverableDefinitionField }
  from './lib/entity/deliverable-definition';

import { SurveyApplication }
  from './lib/entity/survey-application';

export async function updateDeliverableDefinitions(
  queryRunner, deliverableDefinitions) {

  for (const deliverableDefinition of deliverableDefinitions) {
    // find a matching definition, eg; check if it already exists based on
    // the name.
    let ddEntity = await queryRunner.manager
    .getRepository(DeliverableDefinition)
    .findOne({where:`name = '${deliverableDefinition.name}'`});

    if (ddEntity) {
      console.log(
        `Updating deliverable definition ${deliverableDefinition.name}`)
      // delete the definitions fields, we add them back based on the JSON
      // based definition
      await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(DeliverableDefinitionField)
      .where(
        '"deliverableDefinitionId" = :id',
        { id: ddEntity.id })
      .execute();
    } else {
      console.log(
        `Creating new deliverable definition ${deliverableDefinition.name}`)
      // no existing enitity with this definition name, so make a new one
      ddEntity = new DeliverableDefinition();
    }

    // update the entities fields
    _.merge(ddEntity, deliverableDefinition);
    // clear the fields list, need to fill this with entity classes (and not
    // JSON objects)
    ddEntity.fields = [];

    for (const ddf of deliverableDefinition.fields) {
      let ddfEntity = new DeliverableDefinitionField();
      _.merge(ddfEntity, ddf);

      ddfEntity = await queryRunner.manager
      .getRepository(DeliverableDefinitionField)
      .save(ddfEntity);

      ddEntity.fields.push(ddfEntity);
    }

    ddEntity = await queryRunner.manager
    .getRepository(DeliverableDefinition)
    .save(ddEntity);
  }
}


export async function updateSurveyApplications(
  queryRunner, surveyApplications) {

  // get list of all survey applications in db
  let surveyApps = await queryRunner.manager
  .getRepository(SurveyApplication)
  .find();

  // now check if each of the existing entities also exists in the JSON, if
  // not then mark as deleted
  for (const saEntity of surveyApps) {
    let sa = surveyApplications.find((s) => {
      return s.name == saEntity.name;
    });
    if (_.isNil(sa)) {
      console.log(`Marking survey application ${saEntity.name} as deleted`);
      saEntity.deleted = true;
      saEntity = await queryRunner.manager
      .getRepository(SurveyApplication)
      .save(saEntity);
    }
  }


  // loop through all the definitions contained in the json file, adding
  // or updating
  for (const surveyApp of surveyApplications) {
    // find a matching definition, eg; check if it already exists based on
    // the name.
    let saEntity = await queryRunner.manager
    .getRepository(SurveyApplication)
    .findOne({where:`name = '${surveyApp.name}'`});

    if (saEntity) {
      console.log(
        `Updating survey application ${surveyApp.name}`)
    } else {
      console.log(
        `Creating new survey application ${surveyApp.name}`)
      // no existing enitity with this definition name, so make a new one
      saEntity = new SurveyApplication();
    }

    // update the entities fields
    saEntity.name = surveyApp.name;
    saEntity.group = surveyApp.group;

    delete surveyApp.name
    delete surveyApp.group

    // defaults is a JSON db column so we can jam the json object here and
    // worry about decipering it later
    saEntity.defaults = surveyApp;

    saEntity = await queryRunner.manager
    .getRepository(SurveyApplication)
    .save(saEntity);
  }
}
