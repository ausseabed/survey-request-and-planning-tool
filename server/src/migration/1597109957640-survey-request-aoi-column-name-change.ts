import {MigrationInterface, QueryRunner} from "typeorm";

export class surveyRequestAoiColumnNameChange1597109957640 implements MigrationInterface {
    name = 'surveyRequestAoiColumnNameChange1597109957640'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_request_aoi" DROP CONSTRAINT "FK_1b484658d6ffd78f84e69db77ec"`);
        await queryRunner.query(`ALTER TABLE "survey_request_aoi" RENAME COLUMN "surveyRequestId" TO "survey_request_id"`);
        await queryRunner.query(`ALTER TABLE "survey_request_aoi" ADD CONSTRAINT "FK_e285f60c1a821b269dcee1fac46" FOREIGN KEY ("survey_request_id") REFERENCES "survey_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_request_aoi" DROP CONSTRAINT "FK_e285f60c1a821b269dcee1fac46"`);
        await queryRunner.query(`ALTER TABLE "survey_request_aoi" RENAME COLUMN "survey_request_id" TO "surveyRequestId"`);
        await queryRunner.query(`ALTER TABLE "survey_request_aoi" ADD CONSTRAINT "FK_1b484658d6ffd78f84e69db77ec" FOREIGN KEY ("surveyRequestId") REFERENCES "survey_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
