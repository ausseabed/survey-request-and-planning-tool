import {MigrationInterface, QueryRunner} from "typeorm";

export class addedProjectMetadataComment1547162728739 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project_metadata" ADD "comment" character varying`);
        await queryRunner.query(`ALTER TABLE "project_metadata" ALTER COLUMN "projectStatus" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project_metadata" ALTER COLUMN "projectStatus" SET DEFAULT 'planning'`);
        await queryRunner.query(`ALTER TABLE "project_metadata" DROP COLUMN "comment"`);
    }

}
