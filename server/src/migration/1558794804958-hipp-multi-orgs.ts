import {MigrationInterface, QueryRunner} from "typeorm";

export class hippMultiOrgs1558794804958 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "hipp_request" DROP CONSTRAINT "FK_1e88933cee43c7679f91c8ae87c"`);
        await queryRunner.query(`CREATE TABLE "hipp_request_requesting_agencies_organisation" ("hippRequestId" uuid NOT NULL, "organisationId" uuid NOT NULL, CONSTRAINT "PK_a16f145b3c96d5af5e64fe797f2" PRIMARY KEY ("hippRequestId", "organisationId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8bb4d557d61593a6f32b83c2d1" ON "hipp_request_requesting_agencies_organisation" ("hippRequestId") `);
        await queryRunner.query(`CREATE INDEX "IDX_483f53ae6a77b0bf847b99121a" ON "hipp_request_requesting_agencies_organisation" ("organisationId") `);
        await queryRunner.query(`ALTER TABLE "hipp_request" DROP COLUMN "requestingAgencyId"`);
        await queryRunner.query(`ALTER TABLE "hipp_request_requesting_agencies_organisation" ADD CONSTRAINT "FK_8bb4d557d61593a6f32b83c2d15" FOREIGN KEY ("hippRequestId") REFERENCES "hipp_request"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hipp_request_requesting_agencies_organisation" ADD CONSTRAINT "FK_483f53ae6a77b0bf847b99121a1" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "hipp_request_requesting_agencies_organisation" DROP CONSTRAINT "FK_483f53ae6a77b0bf847b99121a1"`);
        await queryRunner.query(`ALTER TABLE "hipp_request_requesting_agencies_organisation" DROP CONSTRAINT "FK_8bb4d557d61593a6f32b83c2d15"`);
        await queryRunner.query(`ALTER TABLE "hipp_request" ADD "requestingAgencyId" uuid`);
        await queryRunner.query(`DROP INDEX "IDX_483f53ae6a77b0bf847b99121a"`);
        await queryRunner.query(`DROP INDEX "IDX_8bb4d557d61593a6f32b83c2d1"`);
        await queryRunner.query(`DROP TABLE "hipp_request_requesting_agencies_organisation"`);
        await queryRunner.query(`ALTER TABLE "hipp_request" ADD CONSTRAINT "FK_1e88933cee43c7679f91c8ae87c" FOREIGN KEY ("requestingAgencyId") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
