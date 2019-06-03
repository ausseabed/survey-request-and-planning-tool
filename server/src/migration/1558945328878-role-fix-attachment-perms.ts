import {MigrationInterface, QueryRunner} from "typeorm";

import { Role } from '../lib/entity/role'

export class roleFixAttachmentPerms1558945328878 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canViewAttachments"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canUploadAttachments"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canDeleteAttachments"`);
        await queryRunner.query(`ALTER TABLE "role" ADD "canViewAllAttachments" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "role" ADD "canViewOrgAttachments" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "role" ADD "canUploadAllAttachments" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "role" ADD "canUploadOrgAttachments" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "role" ADD "canDeleteAllAttachments" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "role" ADD "canDeleteOrgAttachments" boolean NOT NULL DEFAULT false`);

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
        aRole.canEditOrganisation = false
        aRole.canEditUser = false

        aRole.canAddProject = true
        aRole.canViewAllProjects = true
        aRole.canViewOrgProjects = true
        aRole.canEditAllProjects = false
        aRole.canEditOrgProjects = true

        aRole.canAddHippRequest = true
        aRole.canViewAllHippRequests = true
        aRole.canViewOrgHippRequests = true
        aRole.canEditAllHippRequests = false
        aRole.canEditOrgHippRequests = true

        aRole.canViewAllAttachments = true
        aRole.canViewOrgAttachments = true
        aRole.canUploadAllAttachments = false
        aRole.canUploadOrgAttachments = true
        aRole.canDeleteAllAttachments = false
        aRole.canDeleteOrgAttachments = true

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
        aRole.canEditOrganisation = false
        aRole.canEditUser = false

        aRole.canAddProject = false
        aRole.canViewAllProjects = false
        aRole.canViewOrgProjects = true
        aRole.canEditAllProjects = false
        aRole.canEditOrgProjects = false

        aRole.canAddHippRequest = false
        aRole.canViewAllHippRequests = false
        aRole.canViewOrgHippRequests = true
        aRole.canEditAllHippRequests = false
        aRole.canEditOrgHippRequests = false

        aRole.canViewAllAttachments = false
        aRole.canViewOrgAttachments = true
        aRole.canUploadAllAttachments = false
        aRole.canUploadOrgAttachments = false
        aRole.canDeleteAllAttachments = false
        aRole.canDeleteOrgAttachments = false

        aRole = await queryRunner.manager
        .getRepository(Role)
        .save(aRole);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canDeleteOrgAttachments"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canDeleteAllAttachments"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canUploadOrgAttachments"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canUploadAllAttachments"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canViewOrgAttachments"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canViewAllAttachments"`);
        await queryRunner.query(`ALTER TABLE "role" ADD "canDeleteAttachments" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "role" ADD "canUploadAttachments" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "role" ADD "canViewAttachments" boolean NOT NULL DEFAULT false`);
    }

}
