import {MigrationInterface, QueryRunner} from "typeorm";

import { Role } from '../lib/entity/role'

export class roleAddAttachmentPerms1558943286007 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "role" ADD "canViewAttachments" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "role" ADD "canUploadAttachments" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "role" ADD "canDeleteAttachments" boolean NOT NULL DEFAULT false`);

        for (let roleName of ["Administrator", "Basic"]) {
          let aRole = await queryRunner.manager
          .getRepository(Role)
          .findOne({
            where: {
              name: roleName
            }
          });
          aRole.canViewAttachments = true
          aRole.canUploadAttachments = true
          aRole.canDeleteAttachments = true

          aRole = await queryRunner.manager
          .getRepository(Role)
          .save(aRole);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canDeleteAttachments"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canUploadAttachments"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canViewAttachments"`);
    }

}
