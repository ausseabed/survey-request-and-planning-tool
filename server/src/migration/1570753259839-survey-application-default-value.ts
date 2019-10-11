import {MigrationInterface, QueryRunner} from "typeorm";

export class surveyApplicationDefaultValue1570753259839 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "survey_application" ALTER COLUMN "deleted" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "survey_application" ALTER COLUMN "deleted" DROP DEFAULT`);
    }

}
