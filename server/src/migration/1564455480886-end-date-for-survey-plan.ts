import {MigrationInterface, QueryRunner} from "typeorm";

export class endDateForSurveyPlan1564455480886 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project_metadata" ADD "endDate" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project_metadata" DROP COLUMN "endDate"`);
    }

}
