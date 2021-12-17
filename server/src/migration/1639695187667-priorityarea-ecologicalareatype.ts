import { MigrationInterface, QueryRunner } from "typeorm";

export class priorityareaEcologicalareatype1639695187667 implements MigrationInterface {
    name = 'priorityareaEcologicalareatype1639695187667'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area" ADD "ecological_area_type" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area" DROP COLUMN "ecological_area_type"`);
    }

}
