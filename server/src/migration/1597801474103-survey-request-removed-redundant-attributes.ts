import {MigrationInterface, QueryRunner} from "typeorm";

export class surveyRequestRemovedRedundantAttributes1597801474103 implements MigrationInterface {
    name = 'surveyRequestRemovedRedundantAttributes1597801474103'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_request" DROP COLUMN "area"`);
        await queryRunner.query(`ALTER TABLE "survey_request" DROP COLUMN "pointOfContactPhone"`);
        await queryRunner.query(`ALTER TABLE "survey_request" DROP COLUMN "area_of_interest"`);
        await queryRunner.query(`ALTER TABLE "survey_request" DROP COLUMN "comments"`);
        await queryRunner.query(`ALTER TABLE "survey_request" DROP COLUMN "surveyQualityRequirements"`);
        await queryRunner.query(`ALTER TABLE "survey_request" DROP COLUMN "surveyQualityRequirementsComments"`);
        await queryRunner.query(`ALTER TABLE "survey_request" DROP COLUMN "chartProductQualityImpactRequirements"`);
        await queryRunner.query(`ALTER TABLE "survey_request" DROP COLUMN "chartProductQualityImpactRequirementsComments"`);
        await queryRunner.query(`ALTER TABLE "survey_request" DROP COLUMN "riskData"`);
        await queryRunner.query(`ALTER TABLE "survey_request" DROP COLUMN "requestDateStart"`);
        await queryRunner.query(`ALTER TABLE "survey_request" DROP COLUMN "requestDateEnd"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_request" ADD "requestDateEnd" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "survey_request" ADD "requestDateStart" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "survey_request" ADD "riskData" json`);
        await queryRunner.query(`ALTER TABLE "survey_request" ADD "chartProductQualityImpactRequirementsComments" character varying`);
        await queryRunner.query(`ALTER TABLE "survey_request" ADD "chartProductQualityImpactRequirements" text DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "survey_request" ADD "surveyQualityRequirementsComments" character varying`);
        await queryRunner.query(`ALTER TABLE "survey_request" ADD "surveyQualityRequirements" text DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "survey_request" ADD "comments" character varying`);
        await queryRunner.query(`ALTER TABLE "survey_request" ADD "area_of_interest" geometry(MULTIPOLYGON,4326)`);
        await queryRunner.query(`ALTER TABLE "survey_request" ADD "pointOfContactPhone" character varying`);
        await queryRunner.query(`ALTER TABLE "survey_request" ADD "area" character varying`);
    }

}
