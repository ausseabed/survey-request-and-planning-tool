import {MigrationInterface, QueryRunner} from "typeorm";

export class recordStateMoreMetadata1560473486461 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "record_state" ADD "recordType" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "record_state" ADD "changeDescription" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "record_state" DROP COLUMN "changeDescription"`);
        await queryRunner.query(`ALTER TABLE "record_state" DROP COLUMN "recordType"`);
    }

}
