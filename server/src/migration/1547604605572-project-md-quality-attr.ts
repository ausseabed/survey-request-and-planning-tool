import {MigrationInterface, QueryRunner} from "typeorm";

export class projectMdQualityAttr1547604605572 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project_metadata" ADD "quality" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project_metadata" DROP COLUMN "quality"`);
    }

}
