import {MigrationInterface, QueryRunner} from "typeorm";

export class addedSurveyTechSpecs1547423906108 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "survey_technical_specifications" ("contractNumber" character varying, "surveyType" character varying NOT NULL, "surveyFrequency" character varying, "requirements" character varying, "projectMetadataId" uuid NOT NULL, "tendererId" uuid, CONSTRAINT "REL_b3bdf23f4179f65f54bad04a3a" UNIQUE ("projectMetadataId"), CONSTRAINT "PK_b3bdf23f4179f65f54bad04a3a3" PRIMARY KEY ("projectMetadataId"))`);
        await queryRunner.query(`CREATE TABLE "survey_technical_specifications_surveyors_organisation" ("surveyTechnicalSpecificationsProjectMetadataId" uuid NOT NULL, "organisationId" uuid NOT NULL, CONSTRAINT "PK_1c0858920a3a582d8be2a21d175" PRIMARY KEY ("surveyTechnicalSpecificationsProjectMetadataId", "organisationId"))`);
        await queryRunner.query(`CREATE TABLE "organisation_surveyor_survey_technical_specifications_survey_technical_specifications" ("organisationId" uuid NOT NULL, "surveyTechnicalSpecificationsProjectMetadataId" uuid NOT NULL, CONSTRAINT "PK_e5e2becdf9cde15b9dfb1fff07e" PRIMARY KEY ("organisationId", "surveyTechnicalSpecificationsProjectMetadataId"))`);
        await queryRunner.query(`ALTER TABLE "survey_technical_specifications" ADD CONSTRAINT "FK_b3bdf23f4179f65f54bad04a3a3" FOREIGN KEY ("projectMetadataId") REFERENCES "project_metadata"("id")`);
        await queryRunner.query(`ALTER TABLE "survey_technical_specifications" ADD CONSTRAINT "FK_42aa07a024b455889e8f9a760ae" FOREIGN KEY ("tendererId") REFERENCES "organisation"("id")`);
        await queryRunner.query(`ALTER TABLE "survey_technical_specifications_surveyors_organisation" ADD CONSTRAINT "FK_627ade33bb2b939c2845a893e55" FOREIGN KEY ("surveyTechnicalSpecificationsProjectMetadataId") REFERENCES "survey_technical_specifications"("projectMetadataId") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "survey_technical_specifications_surveyors_organisation" ADD CONSTRAINT "FK_e9ca55035f5999e15b42b4fc5cb" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "organisation_surveyor_survey_technical_specifications_survey_technical_specifications" ADD CONSTRAINT "FK_1c4d2ccc51bcfa928a8197c74e4" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "organisation_surveyor_survey_technical_specifications_survey_technical_specifications" ADD CONSTRAINT "FK_80dc39250a739bf4876bb4d4ccc" FOREIGN KEY ("surveyTechnicalSpecificationsProjectMetadataId") REFERENCES "survey_technical_specifications"("projectMetadataId") ON DELETE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "organisation_surveyor_survey_technical_specifications_survey_technical_specifications" DROP CONSTRAINT "FK_80dc39250a739bf4876bb4d4ccc"`);
        await queryRunner.query(`ALTER TABLE "organisation_surveyor_survey_technical_specifications_survey_technical_specifications" DROP CONSTRAINT "FK_1c4d2ccc51bcfa928a8197c74e4"`);
        await queryRunner.query(`ALTER TABLE "survey_technical_specifications_surveyors_organisation" DROP CONSTRAINT "FK_e9ca55035f5999e15b42b4fc5cb"`);
        await queryRunner.query(`ALTER TABLE "survey_technical_specifications_surveyors_organisation" DROP CONSTRAINT "FK_627ade33bb2b939c2845a893e55"`);
        await queryRunner.query(`ALTER TABLE "survey_technical_specifications" DROP CONSTRAINT "FK_42aa07a024b455889e8f9a760ae"`);
        await queryRunner.query(`ALTER TABLE "survey_technical_specifications" DROP CONSTRAINT "FK_b3bdf23f4179f65f54bad04a3a3"`);
        await queryRunner.query(`DROP TABLE "organisation_surveyor_survey_technical_specifications_survey_technical_specifications"`);
        await queryRunner.query(`DROP TABLE "survey_technical_specifications_surveyors_organisation"`);
        await queryRunner.query(`DROP TABLE "survey_technical_specifications"`);
    }

}
