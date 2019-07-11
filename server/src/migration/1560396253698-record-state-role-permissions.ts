import {MigrationInterface, QueryRunner} from "typeorm";

export class recordStateRolePermissions1560396253698 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "role" ADD "canFinaliseAllRecordState" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "role" ADD "canReviseAllRecordState" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "role" ADD "canAcceptAllRecordState" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "role" ADD "canRemoveAllRecordState" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "role" ADD "canFinaliseOrgRecordState" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "role" ADD "canReviseOrgRecordState" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "role" ADD "canAcceptOrgRecordState" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "role" ADD "canRemoveOrgRecordState" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canRemoveOrgRecordState"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canAcceptOrgRecordState"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canReviseOrgRecordState"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canFinaliseOrgRecordState"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canRemoveAllRecordState"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canAcceptAllRecordState"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canReviseAllRecordState"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canFinaliseAllRecordState"`);
    }

}
