import { MigrationInterface, QueryRunner } from "typeorm";

export class priorityareaPurposesandflags1639109917290 implements MigrationInterface {
    name = 'priorityareaPurposesandflags1639109917290'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area" ADD "purposes" text DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "priority_area" ADD "purpose_flags" text DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area" DROP COLUMN "purpose_flags"`);
        await queryRunner.query(`ALTER TABLE "priority_area" DROP COLUMN "purposes"`);
    }

}
