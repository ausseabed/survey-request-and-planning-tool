import { MigrationInterface, QueryRunner } from "typeorm";

export class priorityareaPurposevalues1639353864585 implements MigrationInterface {
    name = 'priorityareaPurposevalues1639353864585'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area" ADD "purpose_values" text DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area" DROP COLUMN "purpose_values"`);
    }

}
