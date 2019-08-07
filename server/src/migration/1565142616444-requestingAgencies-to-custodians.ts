import {MigrationInterface, QueryRunner} from "typeorm";

export class requestingAgenciesToCustodians1565142616444 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "hipp_request_custodians_custodian" ("hippRequestId" uuid NOT NULL, "custodianId" uuid NOT NULL, CONSTRAINT "PK_3925b943c3155601b8c0dbefd8f" PRIMARY KEY ("hippRequestId", "custodianId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e3f224b86fe5e7f24ef9040bf4" ON "hipp_request_custodians_custodian" ("hippRequestId") `);
        await queryRunner.query(`CREATE INDEX "IDX_01a76f88bcb35cde7ad40a580f" ON "hipp_request_custodians_custodian" ("custodianId") `);

        await queryRunner.query(`ALTER TABLE "hipp_request_custodians_custodian" ADD CONSTRAINT "FK_e3f224b86fe5e7f24ef9040bf40" FOREIGN KEY ("hippRequestId") REFERENCES "hipp_request"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hipp_request_custodians_custodian" ADD CONSTRAINT "FK_01a76f88bcb35cde7ad40a580f6" FOREIGN KEY ("custodianId") REFERENCES "custodian"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "hipp_request_custodians_custodian" DROP CONSTRAINT "FK_01a76f88bcb35cde7ad40a580f6"`);
        await queryRunner.query(`ALTER TABLE "hipp_request_custodians_custodian" DROP CONSTRAINT "FK_e3f224b86fe5e7f24ef9040bf40"`);

        await queryRunner.query(`DROP INDEX "IDX_01a76f88bcb35cde7ad40a580f"`);
        await queryRunner.query(`DROP INDEX "IDX_e3f224b86fe5e7f24ef9040bf4"`);
        await queryRunner.query(`DROP TABLE "hipp_request_custodians_custodian"`);
    }

}
