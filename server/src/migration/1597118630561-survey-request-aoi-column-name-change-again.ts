import {MigrationInterface, QueryRunner} from "typeorm";

export class surveyRequestAoiColumnNameChangeAgain1597118630561 implements MigrationInterface {
    name = 'surveyRequestAoiColumnNameChangeAgain1597118630561'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_request_aoi" RENAME COLUMN "surveyStandard" to "survey_standard"`);
        await queryRunner.query(`ALTER TABLE "survey_request_aoi" RENAME COLUMN "overallRisk" to "overall_risk"`);
        await queryRunner.query(`ALTER TABLE "survey_request_aoi" RENAME COLUMN "preferredTimeframe" to "preferred_timeframe"`);
        await queryRunner.query(`ALTER TABLE "survey_request_aoi" RENAME COLUMN "dataTypesToCapture" to "data_types_to_capture"`);
        await queryRunner.query(`ALTER TABLE "survey_request_aoi" RENAME COLUMN "calculatedArea" to "calculated_area"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TABLE "survey_request_aoi" RENAME COLUMN "survey_standard" to "surveyStandard"`);
      await queryRunner.query(`ALTER TABLE "survey_request_aoi" RENAME COLUMN "overall_risk" to "overallRisk"`);
      await queryRunner.query(`ALTER TABLE "survey_request_aoi" RENAME COLUMN "preferred_timeframe" to "preferredTimeframe"`);
      await queryRunner.query(`ALTER TABLE "survey_request_aoi" RENAME COLUMN "data_types_to_capture" to "dataTypesToCapture"`);
      await queryRunner.query(`ALTER TABLE "survey_request_aoi" RENAME COLUMN "calculated_area" to "calculatedArea"`);
    }

}
