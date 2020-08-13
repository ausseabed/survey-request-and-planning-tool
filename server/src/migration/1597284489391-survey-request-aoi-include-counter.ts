import {MigrationInterface, QueryRunner} from "typeorm";

export class surveyRequestAoiIncludeCounter1597284489391 implements MigrationInterface {
    name = 'surveyRequestAoiIncludeCounter1597284489391'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_request_aoi" ADD "counter" SERIAL NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_request_aoi" DROP COLUMN "counter"`);
    }

}
