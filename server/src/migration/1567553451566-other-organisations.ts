import {MigrationInterface, QueryRunner} from "typeorm";

export class otherOrganisations1567553451566 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "survey_plan" ADD "otherOrganisations" character varying`);
        await queryRunner.query(`ALTER TABLE "survey_request" ADD "otherOrganisations" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "survey_request" DROP COLUMN "otherOrganisations"`);
        await queryRunner.query(`ALTER TABLE "survey_plan" DROP COLUMN "otherOrganisations"`);
    }

}
