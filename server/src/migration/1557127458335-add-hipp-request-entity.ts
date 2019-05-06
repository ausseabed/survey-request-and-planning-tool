import {MigrationInterface, QueryRunner} from "typeorm";

export class addHippRequestEntity1557127458335 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "hipp_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "requestorName" character varying, "pointOfContactDetails" character varying, "requestDate" TIMESTAMP WITH TIME ZONE NOT NULL, "areaName" character varying, "area" character varying, "businessJustification" character varying, "costBenefit" character varying, "deleted" boolean NOT NULL DEFAULT false, "requestingAgencyId" uuid, CONSTRAINT "PK_d64edc4bfa350e892c9bef2f1bb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "hipp_request" ADD CONSTRAINT "FK_1e88933cee43c7679f91c8ae87c" FOREIGN KEY ("requestingAgencyId") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "hipp_request" DROP CONSTRAINT "FK_1e88933cee43c7679f91c8ae87c"`);
        await queryRunner.query(`DROP TABLE "hipp_request"`);
    }

}
