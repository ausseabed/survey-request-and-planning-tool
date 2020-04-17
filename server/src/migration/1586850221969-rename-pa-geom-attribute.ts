import {MigrationInterface, QueryRunner} from "typeorm";

export class renamePaGeomAttribute1586850221969 implements MigrationInterface {
    name = 'renamePaGeomAttribute1586850221969'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "priority_area" RENAME COLUMN "area_of_interest" TO "geom"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "priority_area" RENAME COLUMN "geom" TO "area_of_interest"`, undefined);
    }

}
