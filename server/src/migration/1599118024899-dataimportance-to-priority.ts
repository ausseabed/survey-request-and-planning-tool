import {MigrationInterface, QueryRunner} from "typeorm";

export class dataimportanceToPriority1599118024899 implements MigrationInterface {
    name = 'dataimportanceToPriority1599118024899'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area" RENAME COLUMN "dataImportance" TO "priority"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area" RENAME COLUMN "priority" TO "dataImportance"`);
    }

}
