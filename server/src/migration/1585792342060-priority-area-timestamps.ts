import {MigrationInterface, QueryRunner} from "typeorm";

export class priorityAreaTimestamps1585792342060 implements MigrationInterface {
    name = 'priorityAreaTimestamps1585792342060'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "priority_area_submission" ADD "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "priority_area_submission" ADD "lastModified" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "priority_area_submission" DROP COLUMN "lastModified"`, undefined);
        await queryRunner.query(`ALTER TABLE "priority_area_submission" DROP COLUMN "created"`, undefined);
    }

}
