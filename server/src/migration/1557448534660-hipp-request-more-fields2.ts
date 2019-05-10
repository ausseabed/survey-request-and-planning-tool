import {MigrationInterface, QueryRunner} from "typeorm";

export class hippRequestMoreFields21557448534660 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "hipp_request" ADD "surveyQualityRequirements" text NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "hipp_request" ADD "surveyQualityRequirementsComments" character varying`);
        await queryRunner.query(`ALTER TABLE "hipp_request" ADD "chartProductQualityImpactRequirements" text NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "hipp_request" ADD "chartProductQualityImpactRequirementsComments" character varying`);
        await queryRunner.query(`ALTER TABLE "hipp_request" ADD "riskData" json`);
        await queryRunner.query(`ALTER TABLE "hipp_request" ADD "riskIssues" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "hipp_request" DROP COLUMN "riskIssues"`);
        await queryRunner.query(`ALTER TABLE "hipp_request" DROP COLUMN "riskData"`);
        await queryRunner.query(`ALTER TABLE "hipp_request" DROP COLUMN "chartProductQualityImpactRequirementsComments"`);
        await queryRunner.query(`ALTER TABLE "hipp_request" DROP COLUMN "chartProductQualityImpactRequirements"`);
        await queryRunner.query(`ALTER TABLE "hipp_request" DROP COLUMN "surveyQualityRequirementsComments"`);
        await queryRunner.query(`ALTER TABLE "hipp_request" DROP COLUMN "surveyQualityRequirements"`);
    }

}
