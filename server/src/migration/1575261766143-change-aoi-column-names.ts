import {MigrationInterface, QueryRunner} from "typeorm";

export class changeAoiColumnNames1575261766143 implements MigrationInterface {
    name = 'changeAoiColumnNames1575261766143'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "survey_plan" RENAME COLUMN "areaOfInterest" TO "area_of_interest"`, undefined);
        await queryRunner.query(`ALTER TABLE "survey_request" RENAME COLUMN "areaOfInterest" TO "area_of_interest"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "survey_request" RENAME COLUMN "area_of_interest" TO "areaOfInterest"`, undefined);
        await queryRunner.query(`ALTER TABLE "survey_plan" RENAME COLUMN "area_of_interest" TO "areaOfInterest"`, undefined);
    }

}
