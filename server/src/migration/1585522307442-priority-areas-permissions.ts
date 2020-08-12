import {MigrationInterface, QueryRunner} from "typeorm";

import { Role } from '../lib/entity/role';

export class priorityAreasPermissions1585522307442 implements MigrationInterface {
    name = 'priorityAreasPermissions1585522307442'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "role" ADD "canAddPriorityAreaSubmission" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "role" ADD "canViewAllPriorityAreaSubmissions" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "role" ADD "canViewCustodianPriorityAreaSubmissions" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "role" ADD "canEditAllPriorityAreaSubmissions" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "role" ADD "canEditCustodianPriorityAreaSubmission" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "role" ADD "canSubmitAllPriorityAreaSubmission" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "role" ADD "canSubmitCustodianPriorityAreaSubmission" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "role" ADD "canPublishAllPriorityAreaSubmission" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "role" ADD "canPublishCustodianPriorityAreaSubmission" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "role" ADD "canSetPriorityAreaNationalPriority" boolean NOT NULL DEFAULT false`, undefined);

        let aRole = await queryRunner.manager
        .getRepository(Role)
        .findOne({
          where: {
            name: "Administrator"
          }
        });
        if (!aRole) {
          aRole = new Role()
          aRole.name = "Administrator"
          aRole.deleted = false
        }
        // loop through all role attributes and set and of the is* and can*
        // attributes to true. It's the admin user; so should be able to do
        // anything.
        for (let [key, value] of Object.entries(aRole)) {
            if (key.startsWith('is') || key.startsWith('can')) {
              aRole[key] = true;
            }
        }
        aRole.isDefault = false;

        aRole = await queryRunner.manager
        .getRepository(Role)
        .save(aRole);


        aRole = await queryRunner.manager
        .getRepository(Role)
        .findOne({
          where: {
            name: "Basic"
          }
        });
        if (!aRole) {
          aRole = new Role()
          aRole.name = "Basic"
          aRole.deleted = false
        }
        aRole.isDefault = true;
        aRole.isAdmin = false
        aRole.canAddTemplate = false
        aRole.canEditTemplate = false
        aRole.canEditCustodian = false
        aRole.canEditOrganisation = false
        aRole.canEditUser = false
        aRole.canEditRole = false

        aRole.canAddSurveyPlan = true
        aRole.canViewAllSurveyPlans = true
        aRole.canViewCustodianSurveyPlans = true
        aRole.canEditAllSurveyPlans = false
        aRole.canEditCustodianSurveyPlans = true

        aRole.canAddSurveyRequest = true
        aRole.canViewAllSurveyRequests = false
        aRole.canViewCustodianSurveyRequests = true
        aRole.canEditAllSurveyRequests = false
        aRole.canEditCustodianSurveyRequests = true
        aRole.canViewRiskPriority = false

        aRole.canViewAllAttachments = true
        aRole.canViewCustodianAttachments = true
        aRole.canUploadAllAttachments = false
        aRole.canUploadCustodianAttachments = true
        aRole.canDeleteAllAttachments = false
        aRole.canDeleteCustodianAttachments = true

        aRole.canFinaliseAllRecordState = false;
        aRole.canReviseAllRecordState = false;
        aRole.canAcceptAllRecordState = false;
        aRole.canRemoveAllRecordState = false;
        aRole.canFinaliseCustodianRecordState = true;
        aRole.canReviseCustodianRecordState = true;
        aRole.canAcceptCustodianRecordState = false;
        aRole.canRemoveCustodianRecordState = false;

        aRole.canAddPriorityAreaSubmission  = true;
        aRole.canViewAllPriorityAreaSubmissions  = true;
        aRole.canViewCustodianPriorityAreaSubmissions  = true;
        aRole.canEditAllPriorityAreaSubmissions  = false;
        aRole.canEditCustodianPriorityAreaSubmission  = true;
        aRole.canSubmitAllPriorityAreaSubmission  = false;
        aRole.canSubmitCustodianPriorityAreaSubmission  = true;
        aRole.canPublishAllPriorityAreaSubmission  = false;
        aRole.canPublishCustodianPriorityAreaSubmission  = false;
        aRole.canSetPriorityAreaNationalPriority = false;

        aRole = await queryRunner.manager
        .getRepository(Role)
        .save(aRole);


        aRole = await queryRunner.manager
        .getRepository(Role)
        .findOne({
          where: {
            name: "Basic - restricted to organisation"
          }
        });
        if (!aRole) {
          aRole = new Role()
          aRole.name = "Basic - restricted to organisation"
          aRole.deleted = false
        }
        aRole.isDefault = false;
        aRole.isAdmin = false
        aRole.canAddTemplate = false
        aRole.canEditTemplate = false
        aRole.canEditCustodian = false
        aRole.canEditOrganisation = false
        aRole.canEditUser = false
        aRole.canEditRole = false

        aRole.canAddSurveyPlan = false
        aRole.canViewAllSurveyPlans = false
        aRole.canViewCustodianSurveyPlans = true
        aRole.canEditAllSurveyPlans = false
        aRole.canEditCustodianSurveyPlans = false

        aRole.canAddSurveyRequest = false
        aRole.canViewAllSurveyRequests = false
        aRole.canViewCustodianSurveyRequests = true
        aRole.canEditAllSurveyRequests = false
        aRole.canEditCustodianSurveyRequests = false
        aRole.canViewRiskPriority = false

        aRole.canViewAllAttachments = false
        aRole.canViewCustodianAttachments = true
        aRole.canUploadAllAttachments = false
        aRole.canUploadCustodianAttachments = false
        aRole.canDeleteAllAttachments = false
        aRole.canDeleteCustodianAttachments = false

        aRole.canFinaliseAllRecordState = false;
        aRole.canReviseAllRecordState = false;
        aRole.canAcceptAllRecordState = false;
        aRole.canRemoveAllRecordState = false;
        aRole.canFinaliseCustodianRecordState = false;
        aRole.canReviseCustodianRecordState = false;
        aRole.canAcceptCustodianRecordState = false;
        aRole.canRemoveCustodianRecordState = false;

        aRole.canAddPriorityAreaSubmission  = true;
        aRole.canViewAllPriorityAreaSubmissions  = false;
        aRole.canViewCustodianPriorityAreaSubmissions  = true;
        aRole.canEditAllPriorityAreaSubmissions  = false;
        aRole.canEditCustodianPriorityAreaSubmission  = true;
        aRole.canSubmitAllPriorityAreaSubmission  = false;
        aRole.canSubmitCustodianPriorityAreaSubmission  = true;
        aRole.canPublishAllPriorityAreaSubmission  = false;
        aRole.canPublishCustodianPriorityAreaSubmission  = false;
        aRole.canSetPriorityAreaNationalPriority = false;

        aRole = await queryRunner.manager
        .getRepository(Role)
        .save(aRole);


    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canPublishCustodianPriorityAreaSubmission"`, undefined);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canPublishAllPriorityAreaSubmission"`, undefined);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canSubmitCustodianPriorityAreaSubmission"`, undefined);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canSubmitAllPriorityAreaSubmission"`, undefined);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canEditCustodianPriorityAreaSubmission"`, undefined);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canEditAllPriorityAreaSubmissions"`, undefined);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canViewCustodianPriorityAreaSubmissions"`, undefined);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canViewAllPriorityAreaSubmissions"`, undefined);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canAddPriorityAreaSubmission"`, undefined);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canSetPriorityAreaNationalPriority"`, undefined);
    }

}
