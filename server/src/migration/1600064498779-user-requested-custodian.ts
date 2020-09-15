import {MigrationInterface, QueryRunner} from "typeorm";

export class userRequestedCustodian1600064498779 implements MigrationInterface {
    name = 'userRequestedCustodian1600064498779'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "requested_custodian" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "requested_custodian"`);
    }

}
