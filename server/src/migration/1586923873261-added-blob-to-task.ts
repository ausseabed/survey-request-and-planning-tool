import {MigrationInterface, QueryRunner} from "typeorm";

export class addedBlobToTask1586923873261 implements MigrationInterface {
    name = 'addedBlobToTask1586923873261'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "task" ADD "blob" bytea`, undefined);
        await queryRunner.query(`ALTER TABLE "task" ADD "blob_file_name" character varying`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "blob_file_name"`, undefined);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "blob"`, undefined);
    }

}
