import {MigrationInterface, QueryRunner} from "typeorm";

export class hippRequestMoreFields1557360444814 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "hipp_request" DROP COLUMN "pointOfContactDetails"`);
        await queryRunner.query(`ALTER TABLE "hipp_request" ADD "pointOfContactEmail" character varying`);
        await queryRunner.query(`ALTER TABLE "hipp_request" ADD "pointOfContactPhone" character varying`);
        await queryRunner.query(`ALTER TABLE "hipp_request" ADD "areaOfInterest" geometry(MultiPolygon,4326)`);
        await queryRunner.query(`ALTER TABLE "hipp_request" ADD "comments" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "hipp_request" DROP COLUMN "comments"`);
        await queryRunner.query(`ALTER TABLE "hipp_request" DROP COLUMN "areaOfInterest"`);
        await queryRunner.query(`ALTER TABLE "hipp_request" DROP COLUMN "pointOfContactPhone"`);
        await queryRunner.query(`ALTER TABLE "hipp_request" DROP COLUMN "pointOfContactEmail"`);
        await queryRunner.query(`ALTER TABLE "hipp_request" ADD "pointOfContactDetails" character varying`);
    }

}
