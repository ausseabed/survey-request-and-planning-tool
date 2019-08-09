import {MigrationInterface, QueryRunner} from "typeorm";

export class organisationsForProjMetaHipprequest1565314359559 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "organisation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "abn" character varying, "source" character varying, "sourceId" character varying, CONSTRAINT "PK_orgs" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "hipp_request_organisations_organisation" ("hippRequestId" uuid NOT NULL, "organisationId" uuid NOT NULL, CONSTRAINT "PK_1d56a3a49b465a1a6323300722a" PRIMARY KEY ("hippRequestId", "organisationId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_07879357274a8f6254bf40cc9f" ON "hipp_request_organisations_organisation" ("hippRequestId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b212e5cc5aa935ae238fd9c29c" ON "hipp_request_organisations_organisation" ("organisationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2e2d77b3a333884024b3c622f4" ON "project_metadata_organisations_organisation" ("projectMetadataId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2d37249970bb3f672734a40997" ON "project_metadata_organisations_organisation" ("organisationId") `);
        await queryRunner.query(`ALTER TABLE "hipp_request_organisations_organisation" ADD CONSTRAINT "FK_07879357274a8f6254bf40cc9f4" FOREIGN KEY ("hippRequestId") REFERENCES "hipp_request"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hipp_request_organisations_organisation" ADD CONSTRAINT "FK_b212e5cc5aa935ae238fd9c29c8" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "hipp_request_organisations_organisation" DROP CONSTRAINT "FK_b212e5cc5aa935ae238fd9c29c8"`);
        await queryRunner.query(`ALTER TABLE "hipp_request_organisations_organisation" DROP CONSTRAINT "FK_07879357274a8f6254bf40cc9f4"`);
        await queryRunner.query(`DROP INDEX "IDX_2d37249970bb3f672734a40997"`);
        await queryRunner.query(`DROP INDEX "IDX_2e2d77b3a333884024b3c622f4"`);
        await queryRunner.query(`DROP INDEX "IDX_b212e5cc5aa935ae238fd9c29c"`);
        await queryRunner.query(`DROP INDEX "IDX_07879357274a8f6254bf40cc9f"`);
        await queryRunner.query(`DROP TABLE "hipp_request_organisations_organisation"`);
        await queryRunner.query(`DROP TABLE "organisation"`);
    }

}
