import {MigrationInterface, QueryRunner} from "typeorm";

export class organisationDeletedAbnAttribs1554252538913 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "organisation" ADD "abn" character varying`);
        await queryRunner.query(`ALTER TABLE "organisation" ADD "deleted" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "organisation" DROP COLUMN "deleted"`);
        await queryRunner.query(`ALTER TABLE "organisation" DROP COLUMN "abn"`);
    }

}
