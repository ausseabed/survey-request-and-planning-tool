import {MigrationInterface, QueryRunner} from "typeorm";

export class rolePermissionsProjectToSurveyplan1567055453377 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "role" RENAME "canAddProject" TO "canAddSurveyPlan"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME "canViewAllProjects" TO "canViewAllSurveyPlans"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME "canViewCustodianProjects" TO "canViewCustodianSurveyPlans"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME "canEditAllProjects" TO "canEditAllSurveyPlans"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME "canEditCustodianProjects"  TO "canEditCustodianSurveyPlans"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "role" RENAME "canAddSurveyPlan" TO "canAddProject"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME "canViewAllSurveyPlans" TO "canViewAllProjects"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME "canViewCustodianSurveyPlans" TO "canViewCustodianProjects"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME "canEditAllSurveyPlans" TO "canEditAllProjects"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME "canEditCustodianSurveyPlans" TO "canEditCustodianProjects"`);
    }

}
