import {MigrationInterface, QueryRunner} from "typeorm";

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
