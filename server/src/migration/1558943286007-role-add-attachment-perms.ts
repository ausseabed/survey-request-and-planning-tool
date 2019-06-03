import {MigrationInterface, QueryRunner} from "typeorm";

import { Role } from '../lib/entity/role'

export class roleAddAttachmentPerms1558943286007 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "role" ADD "canViewAttachments" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "role" ADD "canUploadAttachments" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "role" ADD "canDeleteAttachments" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canDeleteAttachments"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canUploadAttachments"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canViewAttachments"`);
    }

}
