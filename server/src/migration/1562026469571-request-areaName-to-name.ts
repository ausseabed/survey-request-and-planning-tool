import {MigrationInterface, QueryRunner} from "typeorm";

export class requestAreaNameToName1562026469571 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "hipp_request" RENAME COLUMN "areaName" TO "name"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "hipp_request" RENAME COLUMN "name" TO "areaName"`);
    }

}
