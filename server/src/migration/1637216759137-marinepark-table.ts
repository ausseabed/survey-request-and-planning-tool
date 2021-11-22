import { MigrationInterface, QueryRunner } from "typeorm";

export class marineparksTable1637216759137 implements MigrationInterface {
    name = 'marineparksTable1637216759137'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "marine_park" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "netname" character varying, "resname" character varying, "zonename" character varying, "zoneuicn" character varying, "polygonid" character varying, "natlegend" character varying, "geometry" geometry(MultiPolygon,4326), CONSTRAINT "PK_8735a1f03c4c345b17bd121752b" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "marine_park"`);
    }

}
