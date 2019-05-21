import {MigrationInterface, QueryRunner} from "typeorm";

import { Role } from '../lib/entity/role'

export class addedRoleTable1558404570591 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "deleted" boolean NOT NULL DEFAULT false, "isDefault" boolean NOT NULL DEFAULT false, "isAdmin" boolean NOT NULL DEFAULT false, "canAddTemplate" boolean NOT NULL DEFAULT false, "canViewTemplate" boolean NOT NULL DEFAULT false, "canEditOrganisation" boolean NOT NULL DEFAULT false, "canEditUser" boolean NOT NULL DEFAULT false, "canAddProject" boolean NOT NULL DEFAULT false, "canViewAllProjects" boolean NOT NULL DEFAULT false, "canViewOrgProjects" boolean NOT NULL DEFAULT false, "canEditAllProjects" boolean NOT NULL DEFAULT false, "canEditOrgProjects" boolean NOT NULL DEFAULT false, "canAddHippRequest" boolean NOT NULL DEFAULT false, "canViewAllHippRequests" boolean NOT NULL DEFAULT false, "canViewOrgHippRequests" boolean NOT NULL DEFAULT false, "canEditAllHippRequests" boolean NOT NULL DEFAULT false, "canEditOrgHippRequests" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);

        let adminRoleEntity = new Role();
        adminRoleEntity.name = "Administrator";
        adminRoleEntity.deleted = false

        // loop through all role attributes and set and of the is* and can*
        // attributes to true. It's the admin user; so should be able to do
        // anything.
        for (let [key, value] of Object.entries(adminRoleEntity)) {
            if (key.startsWith('is') || key.startsWith('can')) {
              adminRoleEntity[key] = true;
            }
        }

        // because we don't want every new user to be assigned a admin role
        adminRoleEntity.isDefault = false

        adminRoleEntity = await queryRunner.manager
        .getRepository(Role)
        .save(adminRoleEntity);

        let basicRoleEntity = new Role();
        basicRoleEntity.name = "Basic";
        basicRoleEntity.isDefault = true;
        basicRoleEntity.canViewAllProjects = true;
        basicRoleEntity.canViewOrgProjects = true;
        basicRoleEntity.canViewAllHippRequests = true;
        basicRoleEntity.canViewOrgHippRequests = true;

        basicRoleEntity = await queryRunner.manager
        .getRepository(Role)
        .save(basicRoleEntity);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "role"`);
    }

}
