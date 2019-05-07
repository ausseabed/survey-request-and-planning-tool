import {MigrationInterface, QueryRunner} from "typeorm";

export class refactorFilesToAttachments1557207028149 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "attachment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fileName" character varying NOT NULL, "storage" character varying NOT NULL, "awsUrl" character varying, "blob" bytea NOT NULL, "created" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_d2a80c3a8d467f08a750ac4b420" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "hipp_request_attachment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "entityId" uuid, "attachmentId" uuid, CONSTRAINT "REL_b2c6980a7a35ee2c164914a909" UNIQUE ("attachmentId"), CONSTRAINT "PK_24c44524a7b48af5889b7e54e25" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "survey_attachment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "entityId" uuid, "attachmentId" uuid, CONSTRAINT "REL_53cec1ba628c17b4163d0c1766" UNIQUE ("attachmentId"), CONSTRAINT "PK_e8a0f1d4cc58b0ed6ac6a2a4e9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "hipp_request_attachment" ADD CONSTRAINT "FK_8aad2fe60ec5002ee544be2ad82" FOREIGN KEY ("entityId") REFERENCES "hipp_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hipp_request_attachment" ADD CONSTRAINT "FK_b2c6980a7a35ee2c164914a909e" FOREIGN KEY ("attachmentId") REFERENCES "attachment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_attachment" ADD CONSTRAINT "FK_b89fa7c28c7243f9daac9bb5172" FOREIGN KEY ("entityId") REFERENCES "project_metadata"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_attachment" ADD CONSTRAINT "FK_53cec1ba628c17b4163d0c17663" FOREIGN KEY ("attachmentId") REFERENCES "attachment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "survey_attachment" DROP CONSTRAINT "FK_53cec1ba628c17b4163d0c17663"`);
        await queryRunner.query(`ALTER TABLE "survey_attachment" DROP CONSTRAINT "FK_b89fa7c28c7243f9daac9bb5172"`);
        await queryRunner.query(`ALTER TABLE "hipp_request_attachment" DROP CONSTRAINT "FK_b2c6980a7a35ee2c164914a909e"`);
        await queryRunner.query(`ALTER TABLE "hipp_request_attachment" DROP CONSTRAINT "FK_8aad2fe60ec5002ee544be2ad82"`);
        await queryRunner.query(`DROP TABLE "survey_attachment"`);
        await queryRunner.query(`DROP TABLE "hipp_request_attachment"`);
        await queryRunner.query(`DROP TABLE "attachment"`);
    }

}
