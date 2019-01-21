import {MigrationInterface, QueryRunner} from "typeorm";

export class renameTechSpecs1547781834581 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "tech_spec" ("projectMetadataId" uuid NOT NULL, "contractNumber" character varying, "surveyType" character varying NOT NULL, "surveyFrequency" character varying, "requirements" character varying, "tendererId" uuid, CONSTRAINT "PK_80c5509833c6ccfc3774116030b" PRIMARY KEY ("projectMetadataId"))`);
        await queryRunner.query(`CREATE TABLE "tech_spec_surveyors_organisation" ("techSpecProjectMetadataId" uuid NOT NULL, "organisationId" uuid NOT NULL, CONSTRAINT "PK_1d7c757520228c884c6e79aaa8f" PRIMARY KEY ("techSpecProjectMetadataId", "organisationId"))`);
        await queryRunner.query(`CREATE TABLE "organisation_surveyor_tech_specs_tech_spec" ("organisationId" uuid NOT NULL, "techSpecProjectMetadataId" uuid NOT NULL, CONSTRAINT "PK_1359b35e2cb402a7f686d5ecbe5" PRIMARY KEY ("organisationId", "techSpecProjectMetadataId"))`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD CONSTRAINT "FK_3de4e0f3a51c4ae438e36f084e2" FOREIGN KEY ("tendererId") REFERENCES "organisation"("id")`);
        await queryRunner.query(`ALTER TABLE "tech_spec_surveyors_organisation" ADD CONSTRAINT "FK_8ac0fed7aafeceb9d226d3de5c3" FOREIGN KEY ("techSpecProjectMetadataId") REFERENCES "tech_spec"("projectMetadataId") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tech_spec_surveyors_organisation" ADD CONSTRAINT "FK_681dafe6cdee83d23891bd68ce3" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "organisation_surveyor_tech_specs_tech_spec" ADD CONSTRAINT "FK_98aabab7d3dadba807372b5e830" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "organisation_surveyor_tech_specs_tech_spec" ADD CONSTRAINT "FK_e0d3e4228640bf84706dbb20083" FOREIGN KEY ("techSpecProjectMetadataId") REFERENCES "tech_spec"("projectMetadataId") ON DELETE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "organisation_surveyor_tech_specs_tech_spec" DROP CONSTRAINT "FK_e0d3e4228640bf84706dbb20083"`);
        await queryRunner.query(`ALTER TABLE "organisation_surveyor_tech_specs_tech_spec" DROP CONSTRAINT "FK_98aabab7d3dadba807372b5e830"`);
        await queryRunner.query(`ALTER TABLE "tech_spec_surveyors_organisation" DROP CONSTRAINT "FK_681dafe6cdee83d23891bd68ce3"`);
        await queryRunner.query(`ALTER TABLE "tech_spec_surveyors_organisation" DROP CONSTRAINT "FK_8ac0fed7aafeceb9d226d3de5c3"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP CONSTRAINT "FK_3de4e0f3a51c4ae438e36f084e2"`);
        await queryRunner.query(`DROP TABLE "organisation_surveyor_tech_specs_tech_spec"`);
        await queryRunner.query(`DROP TABLE "tech_spec_surveyors_organisation"`);
        await queryRunner.query(`DROP TABLE "tech_spec"`);
    }

}
