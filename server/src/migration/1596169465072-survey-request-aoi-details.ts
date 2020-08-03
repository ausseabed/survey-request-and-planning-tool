import {MigrationInterface, QueryRunner} from "typeorm";

export class surveyRequestAoiDetails1596169465072 implements MigrationInterface {
    name = 'surveyRequestAoiDetails1596169465072'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_request_aoi" ADD "surveyStandard" character varying`);
        await queryRunner.query(`ALTER TABLE "survey_request_aoi" ADD "overallRisk" character varying`);
        await queryRunner.query(`ALTER TABLE "survey_request_aoi" ADD "preferredTimeframe" character varying`);
        await queryRunner.query(`ALTER TABLE "survey_request" ADD "furtherInformation" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_request" DROP COLUMN "furtherInformation"`);
        await queryRunner.query(`ALTER TABLE "survey_request_aoi" DROP COLUMN "preferredTimeframe"`);
        await queryRunner.query(`ALTER TABLE "survey_request_aoi" DROP COLUMN "overallRisk"`);
        await queryRunner.query(`ALTER TABLE "survey_request_aoi" DROP COLUMN "surveyStandard"`);
    }

}
