import {MigrationInterface, QueryRunner} from "typeorm";

import { Role } from '../lib/entity/role'

export class addRoleBasicRestricted1558929196468 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      let basicResRole = new Role();
      basicResRole.name = "Basic - restricted to organisation";
      basicResRole.canViewOrgProjects = true;
      basicResRole.canViewOrgHippRequests = true;
      basicResRole.canViewOrgAttachments = true;

      basicResRole = await queryRunner.manager
      .getRepository(Role)
      .save(basicResRole);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(Role)
      .where("name = :name", { name: "Basic - restricted to organisation" })
      .execute();
    }

}
