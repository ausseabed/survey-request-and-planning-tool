import {MigrationInterface, QueryRunner} from "typeorm";

export class reprotTemplateValidationDetails1558005619703 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "report_template" ADD "valid" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "report_template" ADD "parameters" json`);
        await queryRunner.query(`ALTER TABLE "report_template" ADD "errors" json`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "report_template" DROP COLUMN "errors"`);
        await queryRunner.query(`ALTER TABLE "report_template" DROP COLUMN "parameters"`);
        await queryRunner.query(`ALTER TABLE "report_template" DROP COLUMN "valid"`);
    }

}
