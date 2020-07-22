import {MigrationInterface, QueryRunner} from "typeorm";

export class removedPlanToRequestRelationship1595318080604 implements MigrationInterface {
    name = 'removedPlanToRequestRelationship1595318080604'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_plan" DROP CONSTRAINT "FK_674f7a47ac8f0189e9be7bfede8"`);
        await queryRunner.query(`ALTER TABLE "survey_plan" DROP COLUMN "surveyRequestId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_plan" ADD "surveyRequestId" uuid`);
        await queryRunner.query(`ALTER TABLE "survey_plan" ADD CONSTRAINT "FK_674f7a47ac8f0189e9be7bfede8" FOREIGN KEY ("surveyRequestId") REFERENCES "survey_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
