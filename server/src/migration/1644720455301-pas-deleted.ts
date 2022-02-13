import { MigrationInterface, QueryRunner } from "typeorm";

export class pasDeleted1644720455301 implements MigrationInterface {
    name = 'pasDeleted1644720455301'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area_submission" ADD "deleted" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area_submission" DROP COLUMN "deleted"`);
    }

}
