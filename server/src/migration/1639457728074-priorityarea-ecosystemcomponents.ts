import { MigrationInterface, QueryRunner } from "typeorm";

export class priorityareaEcosystemcomponents1639457728074 implements MigrationInterface {
    name = 'priorityareaEcosystemcomponents1639457728074'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area" ADD "ecosystem_components" text DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area" DROP COLUMN "ecosystem_components"`);
    }

}
