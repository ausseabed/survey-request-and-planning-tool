import {MigrationInterface, QueryRunner} from "typeorm";

export class surveyRequestOrganisationBugFix1596542330788 implements MigrationInterface {
    name = 'surveyRequestOrganisationBugFix1596542330788'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_request" DROP CONSTRAINT "UQ_7abd3f74fea03161b55962603ae"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_request" ADD CONSTRAINT "UQ_7abd3f74fea03161b55962603ae" UNIQUE ("organisation_id")`);
    }

}
