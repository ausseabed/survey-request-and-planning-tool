import {MigrationInterface, QueryRunner} from "typeorm";

const _ = require('lodash');

import { DeliverableDefinition, DeliverableDefinitionField }
  from '../lib/entity/deliverable-definition';

const deliverableDefinitionsJson =
  require('./deliverable-definitions.json');

export class deliverableDefinitions1549233173362 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "deliverable_definition" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "group" character varying, CONSTRAINT "PK_9109cc6e2e073829c0297e1f2ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "deliverable_definition_field" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "label" character varying, "type" character varying NOT NULL, "options" character varying array, "deliverableDefinitionId" uuid, CONSTRAINT "PK_1be129fe97966ef3125ed5e7749" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "deliverable_definition_field" ADD CONSTRAINT "FK_b46a376d96240242e69d3dabb0a" FOREIGN KEY ("deliverableDefinitionId") REFERENCES "deliverable_definition"("id")`);

        for (const dd of deliverableDefinitionsJson) {
            let ddEntity = new DeliverableDefinition();
            _.merge(ddEntity, dd);
            ddEntity.fields = [];

            for (const ddf of dd.fields) {
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

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "deliverable_definition_field" DROP CONSTRAINT "FK_b46a376d96240242e69d3dabb0a"`);
        await queryRunner.query(`DROP TABLE "deliverable_definition_field"`);
        await queryRunner.query(`DROP TABLE "deliverable_definition"`);
    }

}
