import {MigrationInterface, QueryRunner} from "typeorm";

export class surveyRequestAois1595925216122 implements MigrationInterface {
    name = 'surveyRequestAois1595925216122'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "survey_request_aoi" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "geom" geometry(MultiPolygon,4326), "thumbnail" bytea, "surveyRequestId" uuid, CONSTRAINT "PK_39e485611a39c4c4680d6d99668" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "survey_request" ADD "upload_task_id" uuid`);
        await queryRunner.query(`ALTER TABLE "survey_request_aoi" ADD CONSTRAINT "FK_1b484658d6ffd78f84e69db77ec" FOREIGN KEY ("surveyRequestId") REFERENCES "survey_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_request_aoi" DROP CONSTRAINT "FK_1b484658d6ffd78f84e69db77ec"`);
        await queryRunner.query(`ALTER TABLE "survey_request" DROP COLUMN "upload_task_id"`);
        await queryRunner.query(`DROP TABLE "survey_request_aoi"`);
    }

}
