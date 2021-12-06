import { MigrationInterface, QueryRunner } from "typeorm";

export class priorityareaResolutionandstandard1638748630765 implements MigrationInterface {
    name = 'priorityareaResolutionandstandard1638748630765'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area" ADD "grid_size" character varying`);
        await queryRunner.query(`ALTER TABLE "priority_area" ADD "survey_standard" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area" DROP COLUMN "survey_standard"`);
        await queryRunner.query(`ALTER TABLE "priority_area" DROP COLUMN "grid_size"`);
    }

}
