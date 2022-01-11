import { MigrationInterface, QueryRunner } from "typeorm";

export class priorityareasubmissionCollaboptions1640221030910 implements MigrationInterface {
    name = 'priorityareasubmissionCollaboptions1640221030910'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area_submission" ADD "open_to_collaboration" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "priority_area_submission" ADD "have_funds_resources" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area_submission" DROP COLUMN "have_funds_resources"`);
        await queryRunner.query(`ALTER TABLE "priority_area_submission" DROP COLUMN "open_to_collaboration"`);
    }

}
