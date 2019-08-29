import {MigrationInterface, QueryRunner} from "typeorm";

export class plansRequestsRelationshipNameChange1567063279006 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project_metadata" DROP CONSTRAINT "FK_8cc4115428f9962bdf33fc6a199"`);
        await queryRunner.query(`ALTER TABLE "project_metadata" RENAME COLUMN "hippRequestId" TO "surveyRequestId"`);
        await queryRunner.query(`ALTER TABLE "project_metadata" ADD CONSTRAINT "FK_30800e3bf7719adac13a8f57ae3" FOREIGN KEY ("surveyRequestId") REFERENCES "hipp_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project_metadata" DROP CONSTRAINT "FK_30800e3bf7719adac13a8f57ae3"`);
        await queryRunner.query(`ALTER TABLE "project_metadata" RENAME COLUMN "surveyRequestId" TO "hippRequestId"`);
        await queryRunner.query(`ALTER TABLE "project_metadata" ADD CONSTRAINT "FK_8cc4115428f9962bdf33fc6a199" FOREIGN KEY ("hippRequestId") REFERENCES "hipp_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
