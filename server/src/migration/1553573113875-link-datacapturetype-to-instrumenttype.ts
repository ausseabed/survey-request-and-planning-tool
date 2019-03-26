import {MigrationInterface, QueryRunner} from "typeorm";

export class linkDatacapturetypeToInstrumenttype1553573113875 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "instrument_type_data_capture_types_data_capture_type" ("instrumentTypeId" uuid NOT NULL, "dataCaptureTypeId" uuid NOT NULL, CONSTRAINT "PK_42379d74347d119548e058c23ab" PRIMARY KEY ("instrumentTypeId", "dataCaptureTypeId"))`);
        await queryRunner.query(`ALTER TABLE "instrument_type_data_capture_types_data_capture_type" ADD CONSTRAINT "FK_666945661b4fa522b2e2f7018f9" FOREIGN KEY ("instrumentTypeId") REFERENCES "instrument_type"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "instrument_type_data_capture_types_data_capture_type" ADD CONSTRAINT "FK_c12b91e6c359e63a1cae8f36ecf" FOREIGN KEY ("dataCaptureTypeId") REFERENCES "data_capture_type"("id") ON DELETE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "instrument_type_data_capture_types_data_capture_type" DROP CONSTRAINT "FK_c12b91e6c359e63a1cae8f36ecf"`);
        await queryRunner.query(`ALTER TABLE "instrument_type_data_capture_types_data_capture_type" DROP CONSTRAINT "FK_666945661b4fa522b2e2f7018f9"`);
        await queryRunner.query(`DROP TABLE "instrument_type_data_capture_types_data_capture_type"`);
    }

}
