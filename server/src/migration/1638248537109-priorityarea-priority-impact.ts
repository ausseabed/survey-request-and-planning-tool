import { MigrationInterface, QueryRunner } from "typeorm";

export class priorityareaPriorityImpact1638248537109 implements MigrationInterface {
    name = 'priorityareaPriorityImpact1638248537109'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area" ADD "perceived_impact" character varying`);
        await queryRunner.query(`ALTER TABLE "priority_area" ADD "organisational_priority" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area" DROP COLUMN "organisational_priority"`);
        await queryRunner.query(`ALTER TABLE "priority_area" DROP COLUMN "perceived_impact"`);
    }

}
