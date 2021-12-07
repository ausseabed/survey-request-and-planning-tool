import { MigrationInterface, QueryRunner } from "typeorm";

export class priorityareaDatatypesandcapture1638832180134 implements MigrationInterface {
    name = 'priorityareaDatatypesandcapture1638832180134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area" ADD "data_to_capture" text DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "priority_area" ADD "data_capture_methods" text DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area" DROP COLUMN "data_capture_methods"`);
        await queryRunner.query(`ALTER TABLE "priority_area" DROP COLUMN "data_to_capture"`);
    }

}
