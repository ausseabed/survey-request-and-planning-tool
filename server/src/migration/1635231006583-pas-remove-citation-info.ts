import { MigrationInterface, QueryRunner } from "typeorm";

export class pasRemoveCitationInfo1635231006583 implements MigrationInterface {
    name = 'pasRemoveCitationInfo1635231006583'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area_submission" DROP CONSTRAINT "FK_8ff26124f0549623100c8e5c51d"`);
        await queryRunner.query(`ALTER TABLE "priority_area_submission" DROP COLUMN "citation"`);
        await queryRunner.query(`ALTER TABLE "priority_area_submission" DROP COLUMN "citedContactName"`);
        await queryRunner.query(`ALTER TABLE "priority_area_submission" DROP COLUMN "citedContactEmail"`);
        await queryRunner.query(`ALTER TABLE "priority_area_submission" DROP COLUMN "citedOrganisationId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area_submission" ADD "citedOrganisationId" uuid`);
        await queryRunner.query(`ALTER TABLE "priority_area_submission" ADD "citedContactEmail" character varying`);
        await queryRunner.query(`ALTER TABLE "priority_area_submission" ADD "citedContactName" character varying`);
        await queryRunner.query(`ALTER TABLE "priority_area_submission" ADD "citation" boolean`);
        await queryRunner.query(`ALTER TABLE "priority_area_submission" ADD CONSTRAINT "FK_8ff26124f0549623100c8e5c51d" FOREIGN KEY ("citedOrganisationId") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
