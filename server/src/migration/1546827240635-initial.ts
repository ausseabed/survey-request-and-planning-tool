import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1546827240635 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "project_metadata" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "surveyName" character varying NOT NULL, "contactPerson" character varying NOT NULL, CONSTRAINT "PK_9748d5c1a2a213c7cf912fcd9d8" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "project_metadata"`);
    }

}
