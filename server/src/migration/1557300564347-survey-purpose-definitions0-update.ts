import {MigrationInterface, QueryRunner} from "typeorm";

import { updateDeliverableDefinitions, updateSurveyApplications }
  from '../migration-utils';

const surveyApplications =
  require('./specification-defaults.json');

export class surveyPurposeDefinitions0Update1557300564347 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await updateSurveyApplications(
          queryRunner, surveyApplications);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
