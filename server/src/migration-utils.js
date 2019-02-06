const _ = require('lodash');

import { DeliverableDefinition, DeliverableDefinitionField }
  from './lib/entity/deliverable-definition';

export async function updateDeliverableDefinitions(
  queryRunner, deliverableDefinitions) {

  for (const deliverableDefinition of deliverableDefinitions) {
    console.log(deliverableDefinition);

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
