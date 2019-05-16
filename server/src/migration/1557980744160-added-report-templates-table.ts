import {MigrationInterface, QueryRunner} from "typeorm";

export class addedReportTemplatesTable1557980744160 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "report_template" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "fileName" character varying NOT NULL, "templateType" character varying NOT NULL, "active" boolean NOT NULL DEFAULT true, "storage" character varying NOT NULL, "awsUrl" character varying, "blob" bytea NOT NULL, "created" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_d2952f5126d6e487e73ec6ae6a3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "report_template"`);
    }

}
