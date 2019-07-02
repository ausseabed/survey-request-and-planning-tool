import {MigrationInterface, QueryRunner} from "typeorm";

export class requestSchemaChanges1562025484115 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "hipp_request" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "hipp_request" ADD "requestorPosition" character varying`);
        await queryRunner.query(`ALTER TABLE "hipp_request" ALTER COLUMN "areaOfInterest" TYPE geometry(MultiPolygon,4326)`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "hipp_request" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "hipp_request" DROP COLUMN "requestorPosition"`);
        await queryRunner.query(`ALTER TABLE "hipp_request" ALTER COLUMN "areaOfInterest" TYPE geometry(MULTILINESTRING,4326)`);
    }

}
