import {MigrationInterface, QueryRunner} from "typeorm";

export class addedInstrumentAndCaptureTypes1547081553575 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "instrument_type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "userSubmitted" boolean NOT NULL, CONSTRAINT "PK_4baf0e8d1d9ae48679b44c6065b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "data_capture_type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "userSubmitted" boolean NOT NULL, CONSTRAINT "PK_f01a1a2e99a2632c1c21737cfdb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "instrument_type_project_metadatas_project_metadata" ("instrumentTypeId" uuid NOT NULL, "projectMetadataId" uuid NOT NULL, CONSTRAINT "PK_e1eb573b2a14fd291c7f91381b2" PRIMARY KEY ("instrumentTypeId", "projectMetadataId"))`);
        await queryRunner.query(`CREATE TABLE "project_metadata_data_capture_types_data_capture_type" ("projectMetadataId" uuid NOT NULL, "dataCaptureTypeId" uuid NOT NULL, CONSTRAINT "PK_34573ada60d40598bef6e4dc413" PRIMARY KEY ("projectMetadataId", "dataCaptureTypeId"))`);
        await queryRunner.query(`CREATE TABLE "project_metadata_instrument_types_instrument_type" ("projectMetadataId" uuid NOT NULL, "instrumentTypeId" uuid NOT NULL, CONSTRAINT "PK_a328db6d3ee6f20eaf4ff874a21" PRIMARY KEY ("projectMetadataId", "instrumentTypeId"))`);
        await queryRunner.query(`CREATE TABLE "data_capture_type_project_metadatas_project_metadata" ("dataCaptureTypeId" uuid NOT NULL, "projectMetadataId" uuid NOT NULL, CONSTRAINT "PK_e2665a5074071d03e9b01d3006f" PRIMARY KEY ("dataCaptureTypeId", "projectMetadataId"))`);
        await queryRunner.query(`ALTER TABLE "project_metadata" ALTER COLUMN "startDate" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "instrument_type_project_metadatas_project_metadata" ADD CONSTRAINT "FK_9bb14e7b7ef7bbec3c88f47b403" FOREIGN KEY ("instrumentTypeId") REFERENCES "instrument_type"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "instrument_type_project_metadatas_project_metadata" ADD CONSTRAINT "FK_633582827d4bfd78af6c0912f52" FOREIGN KEY ("projectMetadataId") REFERENCES "project_metadata"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_metadata_data_capture_types_data_capture_type" ADD CONSTRAINT "FK_45a1c9cec861bdcd6d6cd1b4b27" FOREIGN KEY ("projectMetadataId") REFERENCES "project_metadata"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_metadata_data_capture_types_data_capture_type" ADD CONSTRAINT "FK_bf46d2f4f6c38f12dfc9ba60c80" FOREIGN KEY ("dataCaptureTypeId") REFERENCES "data_capture_type"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_metadata_instrument_types_instrument_type" ADD CONSTRAINT "FK_ea20802d04daad872be4944ee1a" FOREIGN KEY ("projectMetadataId") REFERENCES "project_metadata"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_metadata_instrument_types_instrument_type" ADD CONSTRAINT "FK_148de403c76d40665fcdd354e8f" FOREIGN KEY ("instrumentTypeId") REFERENCES "instrument_type"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "data_capture_type_project_metadatas_project_metadata" ADD CONSTRAINT "FK_560427ffdfd097fb2cae8fd6554" FOREIGN KEY ("dataCaptureTypeId") REFERENCES "data_capture_type"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "data_capture_type_project_metadatas_project_metadata" ADD CONSTRAINT "FK_ce9a8ec4d75ede565733db4aef5" FOREIGN KEY ("projectMetadataId") REFERENCES "project_metadata"("id") ON DELETE CASCADE`);

        // seed database with default instrument types
        const stdInstrumentTypes= ['Multibeam', 'Single-beam', 'Bathy LiDAR',
          'Airborne imagery', 'Satellite', 'Side-scan'];
        for (const itName of stdInstrumentTypes) {
          await queryRunner
           .manager
           .createQueryBuilder()
           .insert()
           .into("instrument_type")
           .values({
             name:itName,
             userSubmitted: false
           })
           .execute();
        }

        // seed database with default data capture types
        const stdDataCaptureTypes= ['Bathymetry',
          'Water column backscatter (multibeam only)', 'Seabed Backscatter',
          'SVP', 'Sub-bottom profile', 'Seabed sample'];
        for (const dctName of stdDataCaptureTypes) {
          await queryRunner
           .manager
           .createQueryBuilder()
           .insert()
           .into("data_capture_type")
           .values({
             name:dctName,
             userSubmitted: false
           })
           .execute();
        };
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "data_capture_type_project_metadatas_project_metadata" DROP CONSTRAINT "FK_ce9a8ec4d75ede565733db4aef5"`);
        await queryRunner.query(`ALTER TABLE "data_capture_type_project_metadatas_project_metadata" DROP CONSTRAINT "FK_560427ffdfd097fb2cae8fd6554"`);
        await queryRunner.query(`ALTER TABLE "project_metadata_instrument_types_instrument_type" DROP CONSTRAINT "FK_148de403c76d40665fcdd354e8f"`);
        await queryRunner.query(`ALTER TABLE "project_metadata_instrument_types_instrument_type" DROP CONSTRAINT "FK_ea20802d04daad872be4944ee1a"`);
        await queryRunner.query(`ALTER TABLE "project_metadata_data_capture_types_data_capture_type" DROP CONSTRAINT "FK_bf46d2f4f6c38f12dfc9ba60c80"`);
        await queryRunner.query(`ALTER TABLE "project_metadata_data_capture_types_data_capture_type" DROP CONSTRAINT "FK_45a1c9cec861bdcd6d6cd1b4b27"`);
        await queryRunner.query(`ALTER TABLE "instrument_type_project_metadatas_project_metadata" DROP CONSTRAINT "FK_633582827d4bfd78af6c0912f52"`);
        await queryRunner.query(`ALTER TABLE "instrument_type_project_metadatas_project_metadata" DROP CONSTRAINT "FK_9bb14e7b7ef7bbec3c88f47b403"`);
        await queryRunner.query(`ALTER TABLE "project_metadata" ALTER COLUMN "startDate" SET DEFAULT now()`);
        await queryRunner.query(`DROP TABLE "data_capture_type_project_metadatas_project_metadata"`);
        await queryRunner.query(`DROP TABLE "project_metadata_instrument_types_instrument_type"`);
        await queryRunner.query(`DROP TABLE "project_metadata_data_capture_types_data_capture_type"`);
        await queryRunner.query(`DROP TABLE "instrument_type_project_metadatas_project_metadata"`);
        await queryRunner.query(`DROP TABLE "data_capture_type"`);
        await queryRunner.query(`DROP TABLE "instrument_type"`);
    }

}
