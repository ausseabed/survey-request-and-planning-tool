import {MigrationInterface, QueryRunner} from "typeorm";

export class priorityAreaName1685950457309 implements MigrationInterface {
    name = 'priorityAreaName1685950457309'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area_submission" ADD "submission_name" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area_submission" DROP COLUMN "submission_name"`);
    }

}
