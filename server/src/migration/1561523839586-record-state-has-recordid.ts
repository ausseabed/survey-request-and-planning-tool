import {MigrationInterface, QueryRunner} from "typeorm";

export class recordStateHasRecordid1561523839586 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "record_state" ADD "recordId" uuid NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "record_state" DROP COLUMN "recordId"`);
    }

}
