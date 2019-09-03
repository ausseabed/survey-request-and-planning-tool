import {MigrationInterface, QueryRunner} from "typeorm";

export class publicFlag1567494181358 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "survey_plan" ADD "public" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "survey_request" ADD "public" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "survey_request" DROP COLUMN "public"`);
        await queryRunner.query(`ALTER TABLE "survey_plan" DROP COLUMN "public"`);
    }

}
