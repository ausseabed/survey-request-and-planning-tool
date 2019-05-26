import {MigrationInterface, QueryRunner} from "typeorm";

export class moratoriumCommentAgain1558840822550 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "hipp_request" ADD "moratoriumComment" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "hipp_request" DROP COLUMN "moratoriumComment"`);
    }

}
