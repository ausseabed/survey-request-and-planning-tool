import {MigrationInterface, QueryRunner} from "typeorm";

//
// The following migration was created manually. Seems TypeORM doesn't
// always pick up on tables that have been removed.
//
export class cleanupJoinTables1554091241831 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "instrument_type_project_metadatas_project_metadata"`);
        await queryRunner.query(`DROP TABLE "data_capture_type_project_metadatas_project_metadata"`);
        await queryRunner.query(`DROP TABLE "organisation_project_metadatas_project_metadata"`);
        await queryRunner.query(`DROP TABLE "organisation_surveyor_project_metadatas_project_metadata"`);

        await queryRunner.query(`DROP TABLE "tech_spec_surveyors_organisation"`);
        await queryRunner.query(`DROP TABLE "organisation_surveyor_tech_specs_tech_spec"`);

        await queryRunner.query(`DROP TABLE "survey_technical_specifications_surveyors_organisation"`);
        await queryRunner.query(`DROP TABLE "survey_technical_specifications" CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "instrument_type_project_metadatas_project_metadata" ("instrumentTypeId" uuid NOT NULL, "projectMetadataId" uuid NOT NULL, CONSTRAINT "PK_e1eb573b2a14fd291c7f91381b2" PRIMARY KEY ("instrumentTypeId", "projectMetadataId"))`);
        await queryRunner.query(`CREATE TABLE "data_capture_type_project_metadatas_project_metadata" ("dataCaptureTypeId" uuid NOT NULL, "projectMetadataId" uuid NOT NULL, CONSTRAINT "PK_e2665a5074071d03e9b01d3006f" PRIMARY KEY ("dataCaptureTypeId", "projectMetadataId"))`);
        await queryRunner.query(`CREATE TABLE "organisation_project_metadatas_project_metadata" ("organisationId" uuid NOT NULL, "projectMetadataId" uuid NOT NULL, CONSTRAINT "PK_f4a7638350f073b310d548f7e4a" PRIMARY KEY ("organisationId", "projectMetadataId"))`);
        await queryRunner.query(`CREATE TABLE "organisation_surveyor_project_metadatas_project_metadata" ("organisationId" uuid NOT NULL, "projectMetadataId" uuid NOT NULL, CONSTRAINT "PK_f330443c91d9f82de3001f5f5e3" PRIMARY KEY ("organisationId", "projectMetadataId"))`);

        await queryRunner.query(`CREATE TABLE "tech_spec_surveyors_organisation" ("techSpecProjectMetadataId" uuid NOT NULL, "organisationId" uuid NOT NULL, CONSTRAINT "PK_1d7c757520228c884c6e79aaa8f" PRIMARY KEY ("techSpecProjectMetadataId", "organisationId"))`);
        await queryRunner.query(`CREATE TABLE "organisation_surveyor_tech_specs_tech_spec" ("organisationId" uuid NOT NULL, "techSpecProjectMetadataId" uuid NOT NULL, CONSTRAINT "PK_1359b35e2cb402a7f686d5ecbe5" PRIMARY KEY ("organisationId", "techSpecProjectMetadataId"))`);

        await queryRunner.query(`CREATE TABLE "survey_technical_specifications" ("contractNumber" character varying, "surveyType" character varying NOT NULL, "surveyFrequency" character varying, "requirements" character varying, "projectMetadataId" uuid NOT NULL, "tendererId" uuid, CONSTRAINT "REL_b3bdf23f4179f65f54bad04a3a" UNIQUE ("projectMetadataId"), CONSTRAINT "PK_b3bdf23f4179f65f54bad04a3a3" PRIMARY KEY ("projectMetadataId"))`);
        await queryRunner.query(`CREATE TABLE "survey_technical_specifications_surveyors_organisation" ("surveyTechnicalSpecificationsProjectMetadataId" uuid NOT NULL, "organisationId" uuid NOT NULL, CONSTRAINT "PK_1c0858920a3a582d8be2a21d175" PRIMARY KEY ("surveyTechnicalSpecificationsProjectMetadataId", "organisationId"))`);
    }

}
