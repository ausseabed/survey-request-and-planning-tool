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
        aRole.canViewAllAttachments = true
        aRole.canUploadAllAttachments = true
        aRole.canDeleteAllAttachments = true
        aRole.canViewOrgAttachments = true
        aRole.canUploadOrgAttachments = true
        aRole.canDeleteOrgAttachments = true

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
        aRole.canViewAllAttachments = false
        aRole.canUploadAllAttachments = false
        aRole.canDeleteAllAttachments = false
        aRole.canViewOrgAttachments = true
        aRole.canUploadOrgAttachments = true
        aRole.canDeleteOrgAttachments = true

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
