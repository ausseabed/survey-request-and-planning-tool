import {MigrationInterface, QueryRunner} from "typeorm";

export class surveyRequestPreCalcArea1596549935057 implements MigrationInterface {
    name = 'surveyRequestPreCalcArea1596549935057'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_request_aoi" ADD "calculatedArea" numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_request_aoi" DROP COLUMN "calculatedArea"`);
    }

}
