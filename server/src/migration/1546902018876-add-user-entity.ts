import {MigrationInterface, QueryRunner} from "typeorm";

export class addUserEntity1546902018876 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "user" ("id" character varying NOT NULL, "issuer" character varying NOT NULL, "issuerSub" character varying NOT NULL, "avatar" character varying NOT NULL, "email" character varying NOT NULL, "name" character varying NOT NULL, "accessToken" character varying NOT NULL, "refreshToken" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
