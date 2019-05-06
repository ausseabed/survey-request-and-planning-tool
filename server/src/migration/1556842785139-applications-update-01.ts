import {MigrationInterface, QueryRunner} from "typeorm";

import { updateDeliverableDefinitions, updateSurveyApplications }
  from '../migration-utils';

const deliverableDefinitions =
  require('./deliverable-definitions.json');
const surveyApplications =
  require('./specification-defaults.json');


export class applicationsUpdate011556842785139 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      await updateDeliverableDefinitions(
        queryRunner, deliverableDefinitions);

      await updateSurveyApplications(
        queryRunner, surveyApplications);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}