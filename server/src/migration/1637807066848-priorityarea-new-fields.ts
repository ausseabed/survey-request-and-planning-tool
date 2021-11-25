import { MigrationInterface, QueryRunner } from "typeorm";

export class priorityareaNewFields1637807066848 implements MigrationInterface {
    name = 'priorityareaNewFields1637807066848'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area" ADD "seacountry_name" character varying`);
        await queryRunner.query(`ALTER TABLE "priority_area" ADD "ecological_area_name" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area" DROP COLUMN "ecological_area_name"`);
        await queryRunner.query(`ALTER TABLE "priority_area" DROP COLUMN "seacountry_name"`);
    }

}
