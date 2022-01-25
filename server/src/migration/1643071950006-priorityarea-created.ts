import { MigrationInterface, QueryRunner } from "typeorm";

export class priorityareaCreated1643071950006 implements MigrationInterface {
    name = 'priorityareaCreated1643071950006'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area" ADD "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area" DROP COLUMN "created"`);
    }

}
