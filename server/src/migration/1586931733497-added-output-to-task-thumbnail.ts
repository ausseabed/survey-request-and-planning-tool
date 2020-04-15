import {MigrationInterface, QueryRunner} from "typeorm";

export class addedOutputToTaskThumbnail1586931733497 implements MigrationInterface {
    name = 'addedOutputToTaskThumbnail1586931733497'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "priority_area" ADD "thumbnail" bytea`, undefined);
        await queryRunner.query(`ALTER TABLE "task" ADD "output" json`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "output"`, undefined);
        await queryRunner.query(`ALTER TABLE "priority_area" DROP COLUMN "thumbnail"`, undefined);
    }

}
