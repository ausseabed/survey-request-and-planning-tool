import {MigrationInterface, QueryRunner} from "typeorm";

export class planFieldsNullable1561440045953 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        await queryRunner.query(`ALTER TABLE "project_metadata" ALTER COLUMN "areaOfInterest" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project_metadata" ALTER COLUMN "areaOfInterest" TYPE geometry(MultiPolygon,4326)`);
        await queryRunner.query(`ALTER TABLE "project_metadata" ALTER COLUMN "startDate" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project_metadata" ALTER COLUMN "startDate" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project_metadata" ALTER COLUMN "areaOfInterest" TYPE geometry(MULTILINESTRING,4326)`);
        await queryRunner.query(`ALTER TABLE "project_metadata" ALTER COLUMN "areaOfInterest" SET NOT NULL`);
    }

}
