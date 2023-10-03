import {MigrationInterface, QueryRunner} from "typeorm";

export class removeHippRequestMoratorium1696304888949 implements MigrationInterface {
    name = 'removeHippRequestMoratorium1696304888949'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_request" DROP COLUMN "hasMoratorium"`);
        await queryRunner.query(`ALTER TABLE "survey_request" DROP COLUMN "moratoriumDate"`);
        await queryRunner.query(`ALTER TABLE "survey_request" DROP COLUMN "moratoriumComment"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_request" ADD "moratoriumComment" character varying`);
        await queryRunner.query(`ALTER TABLE "survey_request" ADD "moratoriumDate" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "survey_request" ADD "hasMoratorium" boolean NOT NULL DEFAULT false`);
    }

}
