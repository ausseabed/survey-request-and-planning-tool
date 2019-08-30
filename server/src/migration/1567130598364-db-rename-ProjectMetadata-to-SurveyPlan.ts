import {MigrationInterface, QueryRunner} from "typeorm";

export class dbRenameProjectMetadataToSurveyPlan1567130598364 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.renameTable("project_metadata", "survey_plan");
      await queryRunner.renameTable("project_metadata_applications_survey_application", "survey_plan_applications_survey_application");
      await queryRunner.renameTable("project_metadata_custodians_custodian", "survey_plan_custodians_custodian");
      await queryRunner.renameTable("project_metadata_data_capture_types_data_capture_type", "survey_plan_data_capture_types_data_capture_type");
      await queryRunner.renameTable("project_metadata_instrument_types_instrument_type", "survey_plan_instrument_types_instrument_type");
      await queryRunner.renameTable("project_metadata_organisations_organisation", "survey_plan_organisations_organisation");
      await queryRunner.renameTable("project_metadata_surveyors_organisation", "survey_plan_surveyors_organisation");

      await queryRunner.query(`ALTER TABLE "survey_plan_applications_survey_application" RENAME COLUMN "projectMetadataId" TO "surveyPlanId"`);
      await queryRunner.query(`ALTER TABLE "survey_plan_custodians_custodian" RENAME COLUMN "projectMetadataId" TO "surveyPlanId"`);
      await queryRunner.query(`ALTER TABLE "survey_plan_data_capture_types_data_capture_type" RENAME COLUMN "projectMetadataId" TO "surveyPlanId"`);
      await queryRunner.query(`ALTER TABLE "survey_plan_instrument_types_instrument_type" RENAME COLUMN "projectMetadataId" TO "surveyPlanId"`);
      await queryRunner.query(`ALTER TABLE "survey_plan_organisations_organisation" RENAME COLUMN "projectMetadataId" TO "surveyPlanId"`);
      await queryRunner.query(`ALTER TABLE "survey_plan_surveyors_organisation" RENAME COLUMN "projectMetadataId" TO "surveyPlanId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {

      await queryRunner.query(`ALTER TABLE "survey_plan_applications_survey_application" RENAME COLUMN "surveyPlanId" TO "projectMetadataId"`);
      await queryRunner.query(`ALTER TABLE "survey_plan_custodians_custodian" RENAME COLUMN "surveyPlanId" TO "projectMetadataId"`);
      await queryRunner.query(`ALTER TABLE "survey_plan_data_capture_types_data_capture_type" RENAME COLUMN "surveyPlanId" TO "projectMetadataId"`);
      await queryRunner.query(`ALTER TABLE "survey_plan_instrument_types_instrument_type" RENAME COLUMN "surveyPlanId" TO "projectMetadataId"`);
      await queryRunner.query(`ALTER TABLE "survey_plan_organisations_organisation" RENAME COLUMN "surveyPlanId" TO "projectMetadataId"`);
      await queryRunner.query(`ALTER TABLE "survey_plan_surveyors_organisation" RENAME COLUMN "surveyPlanId" TO "projectMetadataId"`);

      await queryRunner.renameTable("survey_plan", "project_metadata");
      await queryRunner.renameTable("survey_plan_applications_survey_application", "project_metadata_applications_survey_application");
      await queryRunner.renameTable("survey_plan_custodians_custodian", "project_metadata_custodians_custodian");
      await queryRunner.renameTable("survey_plan_data_capture_types_data_capture_type", "project_metadata_data_capture_types_data_capture_type");
      await queryRunner.renameTable("survey_plan_instrument_types_instrument_type", "project_metadata_instrument_types_instrument_type");
      await queryRunner.renameTable("survey_plan_organisations_organisation", "project_metadata_organisations_organisation");
      await queryRunner.renameTable("survey_plan_surveyors_organisation", "project_metadata_surveyors_organisation");

    }

}
