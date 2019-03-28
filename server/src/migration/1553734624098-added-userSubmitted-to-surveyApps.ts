import {MigrationInterface, QueryRunner} from "typeorm";

export class addedUserSubmittedToSurveyApps1553734624098 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "survey_application" ADD "userSubmitted" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "survey_application" DROP COLUMN "userSubmitted"`);
    }

}
