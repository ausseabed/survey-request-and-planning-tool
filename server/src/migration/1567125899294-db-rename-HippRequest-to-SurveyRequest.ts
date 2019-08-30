import {MigrationInterface, QueryRunner} from "typeorm";

export class dbRenameHippRequestToSurveyRequest1567125899294 implements MigrationInterface {


    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.renameTable("hipp_request", "survey_request");
        await queryRunner.renameTable("hipp_request_custodians_custodian", "survey_request_custodians_custodian");
        await queryRunner.renameTable("hipp_request_data_capture_types_data_capture_type", "survey_request_data_capture_types_data_capture_type");
        await queryRunner.renameTable("hipp_request_organisations_organisation", "survey_request_organisations_organisation");
        await queryRunner.renameTable("hipp_request_purposes_request_purpose", "survey_request_purposes_request_purpose");
        await queryRunner.renameTable("hipp_request_requesting_agencies_custodian", "survey_request_requesting_agencies_custodian");
        await queryRunner.renameTable("hipp_request_requesting_agencies_organisation", "survey_request_requesting_agencies_organisation");

        await queryRunner.query(`ALTER TABLE "survey_request_custodians_custodian" RENAME COLUMN "hippRequestId" TO "surveyRequestId"`);
        await queryRunner.query(`ALTER TABLE "survey_request_organisations_organisation" RENAME COLUMN "hippRequestId" TO "surveyRequestId"`);
        await queryRunner.query(`ALTER TABLE "survey_request_purposes_request_purpose" RENAME COLUMN "hippRequestId" TO "surveyRequestId"`);
        await queryRunner.query(`ALTER TABLE "survey_request_data_capture_types_data_capture_type" RENAME COLUMN "hippRequestId" TO "surveyRequestId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "survey_request_custodians_custodian" RENAME COLUMN "surveyRequestId" TO "hippRequestId"`);
        await queryRunner.query(`ALTER TABLE "survey_request_organisations_organisation" RENAME COLUMN "surveyRequestId" TO "hippRequestId"`);
        await queryRunner.query(`ALTER TABLE "survey_request_purposes_request_purpose" RENAME COLUMN "surveyRequestId" TO "hippRequestId"`);
        await queryRunner.query(`ALTER TABLE "survey_request_data_capture_types_data_capture_type" RENAME COLUMN "surveyRequestId" TO "hippRequestId"`);

        await queryRunner.renameTable("survey_request", "hipp_request");
        await queryRunner.renameTable("survey_request_custodians_custodian", "hipp_request_custodians_custodian");
        await queryRunner.renameTable("survey_request_data_capture_types_data_capture_type", "hipp_request_data_capture_types_data_capture_type");
        await queryRunner.renameTable("survey_request_organisations_organisation", "hipp_request_organisations_organisation");
        await queryRunner.renameTable("survey_request_purposes_request_purpose", "hipp_request_purposes_request_purpose");
        await queryRunner.renameTable("survey_request_requesting_agencies_custodian", "hipp_request_requesting_agencies_custodian");
        await queryRunner.renameTable("survey_request_requesting_agencies_organisation", "hipp_request_requesting_agencies_organisation");
    }

}
