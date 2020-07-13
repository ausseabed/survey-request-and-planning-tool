import {MigrationInterface, QueryRunner} from "typeorm";

export class priorityAreaPublishedFlag1594609698259 implements MigrationInterface {
    name = 'priorityAreaPublishedFlag1594609698259'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area_submission" ADD "published" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area_submission" DROP COLUMN "published"`);
    }

}
