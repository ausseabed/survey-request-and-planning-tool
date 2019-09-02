import {MigrationInterface, QueryRunner} from "typeorm";

export class dbRenameMissedDeliverableTable1567401943725 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`ALTER TABLE "survey_deliverable" RENAME COLUMN "projectMetadataId" TO "surveyPlanId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`ALTER TABLE "survey_deliverable" RENAME COLUMN "surveyPlanId" TO "projectMetadataId"`);
    }

}
