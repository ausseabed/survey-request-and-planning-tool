import {MigrationInterface, QueryRunner} from "typeorm";

export class requestRemovedCostBenefit1562027877822 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "hipp_request" DROP COLUMN "costBenefit"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "hipp_request" ADD "costBenefit" character varying`);
    }

}
