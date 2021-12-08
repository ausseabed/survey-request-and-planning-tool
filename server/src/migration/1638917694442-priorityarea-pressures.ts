import { MigrationInterface, QueryRunner } from "typeorm";

export class priorityareaPressures1638917694442 implements MigrationInterface {
    name = 'priorityareaPressures1638917694442'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area" ADD "pressures" text DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area" DROP COLUMN "pressures"`);
    }

}
