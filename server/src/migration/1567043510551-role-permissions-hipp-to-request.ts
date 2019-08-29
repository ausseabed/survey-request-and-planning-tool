import {MigrationInterface, QueryRunner} from "typeorm";

export class rolePermissionsHippToRequest1567043510551 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "role" RENAME "canAddHippRequest" TO "canAddSurveyRequest"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME "canViewAllHippRequests" TO "canViewAllSurveyRequests"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME "canViewCustodianHippRequests" TO "canViewCustodianSurveyRequests"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME "canEditAllHippRequests" TO "canEditAllSurveyRequests"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME "canEditCustodianHippRequests" TO "canEditCustodianSurveyRequests"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`ALTER TABLE "role" RENAME "canAddSurveyRequest" TO "canAddHippRequest"`);
      await queryRunner.query(`ALTER TABLE "role" RENAME "canViewAllSurveyRequests" TO "canViewAllHippRequests"`);
      await queryRunner.query(`ALTER TABLE "role" RENAME "canViewCustodianSurveyRequests" TO "canViewCustodianHippRequests"`);
      await queryRunner.query(`ALTER TABLE "role" RENAME "canEditAllSurveyRequests" TO "canEditAllHippRequests"`);
      await queryRunner.query(`ALTER TABLE "role" RENAME "canEditCustodianSurveyRequests" TO "canEditCustodianHippRequests"`);
    }

}
