import {MigrationInterface, QueryRunner} from "typeorm";

export class hippRequestHasDataCaptureTypes1562745775039 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "hipp_request_data_capture_types_data_capture_type" ("hippRequestId" uuid NOT NULL, "dataCaptureTypeId" uuid NOT NULL, CONSTRAINT "PK_0a3bfc82748e43444fe52ecb8c0" PRIMARY KEY ("hippRequestId", "dataCaptureTypeId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_91c097eba45c9f85b67cdb41bf" ON "hipp_request_data_capture_types_data_capture_type" ("hippRequestId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0456a9ef019a27835c8fd24751" ON "hipp_request_data_capture_types_data_capture_type" ("dataCaptureTypeId") `);
        await queryRunner.query(`ALTER TABLE "hipp_request_data_capture_types_data_capture_type" ADD CONSTRAINT "FK_91c097eba45c9f85b67cdb41bfe" FOREIGN KEY ("hippRequestId") REFERENCES "hipp_request"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hipp_request_data_capture_types_data_capture_type" ADD CONSTRAINT "FK_0456a9ef019a27835c8fd24751b" FOREIGN KEY ("dataCaptureTypeId") REFERENCES "data_capture_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "hipp_request_data_capture_types_data_capture_type" DROP CONSTRAINT "FK_0456a9ef019a27835c8fd24751b"`);
        await queryRunner.query(`ALTER TABLE "hipp_request_data_capture_types_data_capture_type" DROP CONSTRAINT "FK_91c097eba45c9f85b67cdb41bfe"`);
        await queryRunner.query(`DROP INDEX "IDX_0456a9ef019a27835c8fd24751"`);
        await queryRunner.query(`DROP INDEX "IDX_91c097eba45c9f85b67cdb41bf"`);
        await queryRunner.query(`DROP TABLE "hipp_request_data_capture_types_data_capture_type"`);
    }

}
