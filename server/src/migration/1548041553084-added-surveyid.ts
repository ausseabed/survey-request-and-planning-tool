import {MigrationInterface, QueryRunner} from "typeorm";

export class addedSurveyid1548041553084 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project_metadata" ADD "surveyId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project_metadata" DROP COLUMN "surveyId"`);
    }

}
