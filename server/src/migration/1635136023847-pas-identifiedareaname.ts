import { MigrationInterface, QueryRunner } from "typeorm";

export class pasIdentifiedareaname1635136023847 implements MigrationInterface {
    name = 'pasIdentifiedareaname1635136023847'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area_submission" ADD "identifiedAreaName" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area_submission" DROP COLUMN "identifiedAreaName"`);
    }

}
