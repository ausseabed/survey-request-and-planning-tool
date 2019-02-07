import {MigrationInterface, QueryRunner} from "typeorm";

import { updateDeliverableDefinitions, updateSurveyApplications }
  from '../migration-utils';

const deliverableDefinitions =
  require('./deliverable-definitions.json');
const surveyApplications =
  require('./specification-defaults.json');


export class newDefaults1549429487016 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await updateDeliverableDefinitions(
          queryRunner, deliverableDefinitions);

        await updateSurveyApplications(
          queryRunner, surveyApplications);

        // seed database with default data capture types
        const stdDataCaptureTypes= ['Multibeam data'];
        for (const dctName of stdDataCaptureTypes) {
          await queryRunner
           .manager
           .createQueryBuilder()
           .insert()
           .into("data_capture_type")
           .values({
             name:dctName,
             userSubmitted: false
           })
           .execute();
        };
    }

    public async down(queryRunner: QueryRunner): Promise<any> {

    }

}
