import {MigrationInterface, QueryRunner} from "typeorm";

export class surveyFileCreatedTimestamp1548807478533 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "survey_file" ADD "created" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "survey_file" DROP COLUMN "created"`);
    }

}
