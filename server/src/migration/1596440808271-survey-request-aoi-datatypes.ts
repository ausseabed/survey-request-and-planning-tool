import {MigrationInterface, QueryRunner} from "typeorm";

export class surveyRequestAoiDatatypes1596440808271 implements MigrationInterface {
    name = 'surveyRequestAoiDatatypes1596440808271'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_request_aoi" ADD "dataTypesToCapture" text DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_request_aoi" DROP COLUMN "dataTypesToCapture"`);
    }

}
