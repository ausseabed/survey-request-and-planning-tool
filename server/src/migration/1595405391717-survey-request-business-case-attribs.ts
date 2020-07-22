import {MigrationInterface, QueryRunner} from "typeorm";

export class surveyRequestBusinessCaseAttribs1595405391717 implements MigrationInterface {
    name = 'surveyRequestBusinessCaseAttribs1595405391717'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_request" ADD "costBenefit" character varying`);
        await queryRunner.query(`ALTER TABLE "survey_request" ADD "additionalFundingAvailable" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "survey_request" ADD "businessCaseAttachmentId" uuid`);
        await queryRunner.query(`ALTER TABLE "survey_request" ADD CONSTRAINT "UQ_9d13020ecafae3048f1ec81fe57" UNIQUE ("businessCaseAttachmentId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_request" DROP CONSTRAINT "UQ_9d13020ecafae3048f1ec81fe57"`);
        await queryRunner.query(`ALTER TABLE "survey_request" DROP COLUMN "businessCaseAttachmentId"`);
        await queryRunner.query(`ALTER TABLE "survey_request" DROP COLUMN "additionalFundingAvailable"`);
        await queryRunner.query(`ALTER TABLE "survey_request" DROP COLUMN "costBenefit"`);
    }

}
