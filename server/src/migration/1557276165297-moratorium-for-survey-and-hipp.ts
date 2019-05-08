import {MigrationInterface, QueryRunner} from "typeorm";

export class moratoriumForSurveyAndHipp1557276165297 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "hipp_request" ADD "hasMoratorium" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "hipp_request" ADD "moratoriumDate" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "project_metadata" ADD "hasMoratorium" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "project_metadata" ADD "moratoriumDate" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project_metadata" DROP COLUMN "moratoriumDate"`);
        await queryRunner.query(`ALTER TABLE "project_metadata" DROP COLUMN "hasMoratorium"`);
        await queryRunner.query(`ALTER TABLE "hipp_request" DROP COLUMN "moratoriumDate"`);
        await queryRunner.query(`ALTER TABLE "hipp_request" DROP COLUMN "hasMoratorium"`);
    }

}
