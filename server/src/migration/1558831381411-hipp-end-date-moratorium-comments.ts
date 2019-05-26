import {MigrationInterface, QueryRunner} from "typeorm";

export class hippEndDateMoratoriumComments1558831381411 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "hipp_request" DROP COLUMN "requestDate"`);
        await queryRunner.query(`ALTER TABLE "hipp_request" ADD "requestDateStart" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "hipp_request" ADD "requestDateEnd" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "project_metadata" ADD "moratoriumComment" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project_metadata" DROP COLUMN "moratoriumComment"`);
        await queryRunner.query(`ALTER TABLE "hipp_request" DROP COLUMN "requestDateEnd"`);
        await queryRunner.query(`ALTER TABLE "hipp_request" DROP COLUMN "requestDateStart"`);
        await queryRunner.query(`ALTER TABLE "hipp_request" ADD "requestDate" TIMESTAMP WITH TIME ZONE NOT NULL`);
    }

}
