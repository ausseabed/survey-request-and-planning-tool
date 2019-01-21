import {MigrationInterface, QueryRunner} from "typeorm";

export class refactorSurveymdIntoProjectmd1548040956635 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP CONSTRAINT "FK_3de4e0f3a51c4ae438e36f084e2"`);
        await queryRunner.query(`CREATE TABLE "organisation_surveyor_project_metadatas_project_metadata" ("organisationId" uuid NOT NULL, "projectMetadataId" uuid NOT NULL, CONSTRAINT "PK_f330443c91d9f82de3001f5f5e3" PRIMARY KEY ("organisationId", "projectMetadataId"))`);
        await queryRunner.query(`CREATE TABLE "project_metadata_surveyors_organisation" ("projectMetadataId" uuid NOT NULL, "organisationId" uuid NOT NULL, CONSTRAINT "PK_d6c77440f2a9d4bd97b81f6ee10" PRIMARY KEY ("projectMetadataId", "organisationId"))`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP CONSTRAINT "PK_80c5509833c6ccfc3774116030b" CASCADE`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "projectMetadataId"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "contractNumber"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "tendererId"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD CONSTRAINT "PK_07e60d3d61bc18676e6c9fe2704" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "project_metadata" ADD "contractNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "project_metadata" ADD "tendererId" uuid`);
        await queryRunner.query(`ALTER TABLE "project_metadata" ADD CONSTRAINT "FK_13f5cf9370824f529e308ff29bb" FOREIGN KEY ("tendererId") REFERENCES "organisation"("id")`);
        await queryRunner.query(`ALTER TABLE "organisation_surveyor_project_metadatas_project_metadata" ADD CONSTRAINT "FK_89233e97a07b1f1e125d82290f7" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "organisation_surveyor_project_metadatas_project_metadata" ADD CONSTRAINT "FK_a935225eac84bd15beaca7ea3a1" FOREIGN KEY ("projectMetadataId") REFERENCES "project_metadata"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_metadata_surveyors_organisation" ADD CONSTRAINT "FK_6c1a1c8493eca7fa772085119c9" FOREIGN KEY ("projectMetadataId") REFERENCES "project_metadata"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_metadata_surveyors_organisation" ADD CONSTRAINT "FK_cf26e6f05921378d1e9e3cc2cca" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project_metadata_surveyors_organisation" DROP CONSTRAINT "FK_cf26e6f05921378d1e9e3cc2cca"`);
        await queryRunner.query(`ALTER TABLE "project_metadata_surveyors_organisation" DROP CONSTRAINT "FK_6c1a1c8493eca7fa772085119c9"`);
        await queryRunner.query(`ALTER TABLE "organisation_surveyor_project_metadatas_project_metadata" DROP CONSTRAINT "FK_a935225eac84bd15beaca7ea3a1"`);
        await queryRunner.query(`ALTER TABLE "organisation_surveyor_project_metadatas_project_metadata" DROP CONSTRAINT "FK_89233e97a07b1f1e125d82290f7"`);
        await queryRunner.query(`ALTER TABLE "project_metadata" DROP CONSTRAINT "FK_13f5cf9370824f529e308ff29bb"`);
        await queryRunner.query(`ALTER TABLE "project_metadata" DROP COLUMN "tendererId"`);
        await queryRunner.query(`ALTER TABLE "project_metadata" DROP COLUMN "contractNumber"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP CONSTRAINT "PK_07e60d3d61bc18676e6c9fe2704"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "tendererId" uuid`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "contractNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "projectMetadataId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD CONSTRAINT "PK_80c5509833c6ccfc3774116030b" PRIMARY KEY ("projectMetadataId")`);
        await queryRunner.query(`DROP TABLE "project_metadata_surveyors_organisation"`);
        await queryRunner.query(`DROP TABLE "organisation_surveyor_project_metadatas_project_metadata"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD CONSTRAINT "FK_3de4e0f3a51c4ae438e36f084e2" FOREIGN KEY ("tendererId") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
