import {MigrationInterface, QueryRunner} from "typeorm";

export class addAreaofinterestGeomColumn1546942620386 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        // // If you have data in the database...
        // await queryRunner.query(`DELETE FROM "project_metadata"`);
        await queryRunner.query(`ALTER TABLE "project_metadata" ADD "areaOfInterest" geometry NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project_metadata" DROP COLUMN "areaOfInterest"`);
    }

}
