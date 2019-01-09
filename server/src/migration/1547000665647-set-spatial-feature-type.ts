import {MigrationInterface, QueryRunner} from "typeorm";

export class setSpatialFeatureType1547000665647 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project_metadata" ALTER COLUMN "areaOfInterest" TYPE geometry(MultiPolygon,4326)`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project_metadata" ALTER COLUMN "areaOfInterest" TYPE geometry(GEOMETRY,0)`);
    }

}
