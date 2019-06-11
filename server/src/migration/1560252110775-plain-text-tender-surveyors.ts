import {MigrationInterface, QueryRunner} from "typeorm";

export class plainTextTenderSurveyors1560252110775 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project_metadata" DROP CONSTRAINT "FK_13f5cf9370824f529e308ff29bb"`);
        await queryRunner.query(`ALTER TABLE "project_metadata" DROP COLUMN "tendererId"`);
        await queryRunner.query(`ALTER TABLE "project_metadata" ADD "tenderer" character varying`);
        await queryRunner.query(`ALTER TABLE "project_metadata" ADD "surveyors" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project_metadata" DROP COLUMN "surveyors"`);
        await queryRunner.query(`ALTER TABLE "project_metadata" DROP COLUMN "tenderer"`);
        await queryRunner.query(`ALTER TABLE "project_metadata" ADD "tendererId" uuid`);
        await queryRunner.query(`ALTER TABLE "project_metadata" ADD CONSTRAINT "FK_13f5cf9370824f529e308ff29bb" FOREIGN KEY ("tendererId") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
