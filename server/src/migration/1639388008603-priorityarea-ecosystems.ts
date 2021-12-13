import { MigrationInterface, QueryRunner } from "typeorm";

export class priorityareaEcosystems1639388008603 implements MigrationInterface {
    name = 'priorityareaEcosystems1639388008603'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area" ADD "ecosystems" text DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area" DROP COLUMN "ecosystems"`);
    }

}
