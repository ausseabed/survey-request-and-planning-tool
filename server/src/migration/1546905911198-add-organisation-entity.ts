import {MigrationInterface, QueryRunner} from "typeorm";

export class addOrganisationEntity1546905911198 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "organisation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_c725ae234ef1b74cce43d2d00c1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_metadata_organisations_organisation" ("projectMetadataId" uuid NOT NULL, "organisationId" uuid NOT NULL, CONSTRAINT "PK_39ac8151cc36bd01717d78b54fd" PRIMARY KEY ("projectMetadataId", "organisationId"))`);
        await queryRunner.query(`CREATE TABLE "organisation_project_metadatas_project_metadata" ("organisationId" uuid NOT NULL, "projectMetadataId" uuid NOT NULL, CONSTRAINT "PK_f4a7638350f073b310d548f7e4a" PRIMARY KEY ("organisationId", "projectMetadataId"))`);
        await queryRunner.query(`ALTER TABLE "project_metadata_organisations_organisation" ADD CONSTRAINT "FK_2e2d77b3a333884024b3c622f46" FOREIGN KEY ("projectMetadataId") REFERENCES "project_metadata"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_metadata_organisations_organisation" ADD CONSTRAINT "FK_2d37249970bb3f672734a409976" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "organisation_project_metadatas_project_metadata" ADD CONSTRAINT "FK_e1cc65ba733c4794c68a05e36bd" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "organisation_project_metadatas_project_metadata" ADD CONSTRAINT "FK_c46c0a38d28ba707cb1e50521c4" FOREIGN KEY ("projectMetadataId") REFERENCES "project_metadata"("id") ON DELETE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "organisation_project_metadatas_project_metadata" DROP CONSTRAINT "FK_c46c0a38d28ba707cb1e50521c4"`);
        await queryRunner.query(`ALTER TABLE "organisation_project_metadatas_project_metadata" DROP CONSTRAINT "FK_e1cc65ba733c4794c68a05e36bd"`);
        await queryRunner.query(`ALTER TABLE "project_metadata_organisations_organisation" DROP CONSTRAINT "FK_2d37249970bb3f672734a409976"`);
        await queryRunner.query(`ALTER TABLE "project_metadata_organisations_organisation" DROP CONSTRAINT "FK_2e2d77b3a333884024b3c622f46"`);
        await queryRunner.query(`DROP TABLE "organisation_project_metadatas_project_metadata"`);
        await queryRunner.query(`DROP TABLE "project_metadata_organisations_organisation"`);
        await queryRunner.query(`DROP TABLE "organisation"`);
    }

}
