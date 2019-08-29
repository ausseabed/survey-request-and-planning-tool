import {MigrationInterface, QueryRunner} from "typeorm";

export class projectStatusToStatus1567058270440 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project_metadata" RENAME COLUMN "projectStatus" TO "status"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project_metadata" RENAME COLUMN "status" TO "projectStatus"`);
    }

}
