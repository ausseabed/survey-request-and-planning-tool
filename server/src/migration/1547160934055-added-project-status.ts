import {MigrationInterface, QueryRunner} from "typeorm";

export class addedProjectStatus1547160934055 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project_metadata" ADD "projectStatus" character varying NOT NULL DEFAULT 'planning'`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project_metadata" DROP COLUMN "projectStatus"`);
    }

}
