import { MigrationInterface, QueryRunner } from "typeorm";

export class pasGeographicalareaname1635209893291 implements MigrationInterface {
    name = 'pasGeographicalareaname1635209893291'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area_submission" ADD "geographicalAreaName" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area_submission" DROP COLUMN "geographicalAreaName"`);
    }

}
