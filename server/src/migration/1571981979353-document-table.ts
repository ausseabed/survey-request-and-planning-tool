import {MigrationInterface, QueryRunner} from "typeorm";

export class documentTable1571981979353 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "document" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "documentType" character varying NOT NULL, "fileName" character varying NOT NULL, "mimeType" character varying NOT NULL, "active" boolean NOT NULL DEFAULT true, "storage" character varying NOT NULL, "awsUrl" character varying, "blob" bytea NOT NULL, "created" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_e57d3357f83f3cdc0acffc3d777" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "document"`);
    }

}
