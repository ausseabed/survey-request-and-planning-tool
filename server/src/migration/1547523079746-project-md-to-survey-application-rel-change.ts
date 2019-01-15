import {MigrationInterface, QueryRunner} from "typeorm";

export class projectMdToSurveyApplicationRelChange1547523079746 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        // this will have been created by a prior migration (so drop)
        await queryRunner.query(`DROP TABLE "organisation_surveyor_survey_technical_specifications_survey_technical_specifications"`);

        await queryRunner.query(`CREATE TABLE "organisation_surveyor_survey_technical_specifications_survey_technical_specifications" ("organisationId" uuid NOT NULL, "surveyTechnicalSpecificationsProjectMetadataId" uuid NOT NULL, CONSTRAINT "PK_e5e2becdf9cde15b9dfb1fff07e" PRIMARY KEY ("organisationId", "surveyTechnicalSpecificationsProjectMetadataId"))`);
        await queryRunner.query(`ALTER TABLE "project_metadata" ADD "surveyApplicationId" uuid`);
        await queryRunner.query(`ALTER TABLE "project_metadata" ADD CONSTRAINT "FK_38c531f008eca6f5528f9f810ed" FOREIGN KEY ("surveyApplicationId") REFERENCES "survey_application"("id")`);
        await queryRunner.query(`ALTER TABLE "organisation_surveyor_survey_technical_specifications_survey_technical_specifications" ADD CONSTRAINT "FK_1c4d2ccc51bcfa928a8197c74e4" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "organisation_surveyor_survey_technical_specifications_survey_technical_specifications" ADD CONSTRAINT "FK_80dc39250a739bf4876bb4d4ccc" FOREIGN KEY ("surveyTechnicalSpecificationsProjectMetadataId") REFERENCES "survey_technical_specifications"("projectMetadataId") ON DELETE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "organisation_surveyor_survey_technical_specifications_survey_technical_specifications" DROP CONSTRAINT "FK_80dc39250a739bf4876bb4d4ccc"`);
        await queryRunner.query(`ALTER TABLE "organisation_surveyor_survey_technical_specifications_survey_technical_specifications" DROP CONSTRAINT "FK_1c4d2ccc51bcfa928a8197c74e4"`);
        await queryRunner.query(`ALTER TABLE "project_metadata" DROP CONSTRAINT "FK_38c531f008eca6f5528f9f810ed"`);
        await queryRunner.query(`ALTER TABLE "project_metadata" DROP COLUMN "surveyApplicationId"`);
        await queryRunner.query(`DROP TABLE "organisation_surveyor_survey_technical_specifications_survey_technical_specifications"`);

        // the next down revert (or maybe one after) will attempt to drop this.
        // so it needs to be created here.
        await queryRunner.query(`CREATE TABLE "organisation_surveyor_survey_technical_specifications_survey_technical_specifications" ("organisationId" uuid NOT NULL, "surveyTechnicalSpecificationsProjectMetadataId" uuid NOT NULL, CONSTRAINT "PK_e5e2becdf9cde15b9dfb1fff07e" PRIMARY KEY ("organisationId", "surveyTechnicalSpecificationsProjectMetadataId"))`);
    }

}
