import {MigrationInterface, QueryRunner} from "typeorm";

export class surveyFile1548724079570 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "survey_file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fileName" character varying NOT NULL, "storage" character varying NOT NULL, "awsUrl" character varying, "blob" bytea NOT NULL, "projectMetadataId" uuid, CONSTRAINT "PK_948410e7d01fe38c0867a34f95b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "survey_file" ADD CONSTRAINT "FK_88a77f08947a454d939ef4912e2" FOREIGN KEY ("projectMetadataId") REFERENCES "project_metadata"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "survey_file" DROP CONSTRAINT "FK_88a77f08947a454d939ef4912e2"`);
        await queryRunner.query(`DROP TABLE "survey_file"`);
    }

}
