import {MigrationInterface, QueryRunner} from "typeorm";

export class surveyRequestCleanup1596784614735 implements MigrationInterface {
    name = 'surveyRequestCleanup1596784614735'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_request" DROP COLUMN "otherOrganisations"`);
        await queryRunner.query(`DROP TABLE "survey_request_purposes_request_purpose"`);
        await queryRunner.query(`DROP TABLE "survey_request_data_capture_types_data_capture_type"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "survey_request_data_capture_types_data_capture_type" ("surveyRequestId" uuid NOT NULL, "dataCaptureTypeId" uuid NOT NULL, CONSTRAINT "PK_0a3bfc82748e43444fe52ecb8c0" PRIMARY KEY ("surveyRequestId", "dataCaptureTypeId"))`);
        await queryRunner.query(`CREATE TABLE "survey_request_purposes_request_purpose" ("surveyRequestId" uuid NOT NULL, "requestPurposeId" uuid NOT NULL, CONSTRAINT "PK_b25f4008b1afe79ad087a92fcc8" PRIMARY KEY ("surveyRequestId", "requestPurposeId"))`);
        await queryRunner.query(`ALTER TABLE "survey_request" ADD "otherOrganisations" character varying`);
    }

}
