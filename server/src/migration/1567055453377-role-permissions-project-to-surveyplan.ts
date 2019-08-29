import {MigrationInterface, QueryRunner} from "typeorm";

import { Role } from '../lib/entity/role'

export class rolePermissionsProjectToSurveyplan1567055453377 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "role" RENAME "canAddProject" TO "canAddSurveyPlan"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME "canViewAllProjects" TO "canViewAllSurveyPlans"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME "canViewCustodianProjects" TO "canViewCustodianSurveyPlans"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME "canEditAllProjects" TO "canEditAllSurveyPlans"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME "canEditCustodianProjects"  TO "canEditCustodianSurveyPlans"`);

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
        aRole.canViewAllSurveyRequests = true
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


        aRole = await queryRunner.manager
        .getRepository(Role)
        .save(aRole);

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "role" RENAME "canAddSurveyPlan" TO "canAddProject"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME "canViewAllSurveyPlans" TO "canViewAllProjects"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME "canViewCustodianSurveyPlans" TO "canViewCustodianProjects"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME "canEditAllSurveyPlans" TO "canEditAllProjects"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME "canEditCustodianSurveyPlans" TO "canEditCustodianProjects"`);
    }

}
