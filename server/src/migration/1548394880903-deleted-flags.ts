import {MigrationInterface, QueryRunner} from "typeorm";

export class deletedFlags1548394880903 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "deleted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "project_metadata" ADD "deleted" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project_metadata" DROP COLUMN "deleted"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "deleted"`);
    }

}
