import { MigrationInterface, QueryRunner } from "typeorm";

export class priorityareaExistingData1638509515656 implements MigrationInterface {
    name = 'priorityareaExistingData1638509515656'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area" ADD "existing_data_sources" text DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "priority_area" ADD "reason_for_aoi_raise" character varying`);
        await queryRunner.query(`ALTER TABLE "priority_area" ADD "existing_data_assessment_comments" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area" DROP COLUMN "existing_data_assessment_comments"`);
        await queryRunner.query(`ALTER TABLE "priority_area" DROP COLUMN "reason_for_aoi_raise"`);
        await queryRunner.query(`ALTER TABLE "priority_area" DROP COLUMN "existing_data_sources"`);
    }

}
