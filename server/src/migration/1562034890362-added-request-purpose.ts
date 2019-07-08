import {MigrationInterface, QueryRunner} from "typeorm";

export class addedRequestPurpose1562034890362 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "request_purpose" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "group" character varying NOT NULL, CONSTRAINT "PK_11384bd03e0b924ce76660468ce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "hipp_request_purposes_request_purpose" ("hippRequestId" uuid NOT NULL, "requestPurposeId" uuid NOT NULL, CONSTRAINT "PK_b25f4008b1afe79ad087a92fcc8" PRIMARY KEY ("hippRequestId", "requestPurposeId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_04ecf16c66a0295a32a6ae127d" ON "hipp_request_purposes_request_purpose" ("hippRequestId") `);
        await queryRunner.query(`CREATE INDEX "IDX_443ce08b2b588ee2ba49281c88" ON "hipp_request_purposes_request_purpose" ("requestPurposeId") `);
        await queryRunner.query(`ALTER TABLE "hipp_request_purposes_request_purpose" ADD CONSTRAINT "FK_04ecf16c66a0295a32a6ae127dc" FOREIGN KEY ("hippRequestId") REFERENCES "hipp_request"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hipp_request_purposes_request_purpose" ADD CONSTRAINT "FK_443ce08b2b588ee2ba49281c884" FOREIGN KEY ("requestPurposeId") REFERENCES "request_purpose"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "hipp_request_purposes_request_purpose" DROP CONSTRAINT "FK_443ce08b2b588ee2ba49281c884"`);
        await queryRunner.query(`ALTER TABLE "hipp_request_purposes_request_purpose" DROP CONSTRAINT "FK_04ecf16c66a0295a32a6ae127dc"`);
        await queryRunner.query(`DROP INDEX "IDX_443ce08b2b588ee2ba49281c88"`);
        await queryRunner.query(`DROP INDEX "IDX_04ecf16c66a0295a32a6ae127d"`);
        await queryRunner.query(`DROP TABLE "hipp_request_purposes_request_purpose"`);
        await queryRunner.query(`DROP TABLE "request_purpose"`);
    }

}
