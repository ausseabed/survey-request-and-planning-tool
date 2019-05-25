import {MigrationInterface, QueryRunner} from "typeorm";

import { updateDeliverableDefinitions }
  from '../migration-utils';

const deliverableDefinitions =
  require('./deliverable-definitions.json');


export class applicationsUpdate011556842785139 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      await updateDeliverableDefinitions(
        queryRunner, deliverableDefinitions);

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
