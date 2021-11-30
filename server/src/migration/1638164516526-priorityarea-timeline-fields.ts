import { MigrationInterface, QueryRunner } from "typeorm";

export class priorityareaTimelineFields1638164516526 implements MigrationInterface {
    name = 'priorityareaTimelineFields1638164516526'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area" ADD "timeframe_reason" character varying`);
        await queryRunner.query(`ALTER TABLE "priority_area" ADD "preferred_season" character varying`);
        await queryRunner.query(`ALTER TABLE "priority_area" ADD "collection_cadence" character varying`);
        await queryRunner.query(`ALTER TABLE "priority_area" ADD "time_series_description" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area" DROP COLUMN "time_series_description"`);
        await queryRunner.query(`ALTER TABLE "priority_area" DROP COLUMN "collection_cadence"`);
        await queryRunner.query(`ALTER TABLE "priority_area" DROP COLUMN "preferred_season"`);
        await queryRunner.query(`ALTER TABLE "priority_area" DROP COLUMN "timeframe_reason"`);
    }

}
