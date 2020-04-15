import {MigrationInterface, QueryRunner} from "typeorm";

export class addedTaskTable1586913482218 implements MigrationInterface {
    name = 'addedTaskTable1586913482218'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "task_state_enum" AS ENUM('NOT_STARTED', 'STARTED', 'COMPLETED', 'FAILED')`, undefined);
        await queryRunner.query(`CREATE TYPE "task_progress_type_enum" AS ENUM('INDETERMINATE', 'PERCENT')`, undefined);
        await queryRunner.query(`CREATE TABLE "task" ("id" character varying NOT NULL, "state" "task_state_enum" NOT NULL DEFAULT 'NOT_STARTED', "progress_type" "task_progress_type_enum" NOT NULL DEFAULT 'INDETERMINATE', "progress" integer NOT NULL DEFAULT 0, "status_message" character varying, "error_message" character varying, "last_updated" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "priority_area_submission" ADD "upload_task_id" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "priority_area_submission" ADD CONSTRAINT "UQ_52637fe03c3115329d724bb364d" UNIQUE ("upload_task_id")`, undefined);
        await queryRunner.query(`ALTER TABLE "priority_area_submission" ADD CONSTRAINT "FK_52637fe03c3115329d724bb364d" FOREIGN KEY ("upload_task_id") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "priority_area_submission" DROP CONSTRAINT "FK_52637fe03c3115329d724bb364d"`, undefined);
        await queryRunner.query(`ALTER TABLE "priority_area_submission" DROP CONSTRAINT "UQ_52637fe03c3115329d724bb364d"`, undefined);
        await queryRunner.query(`ALTER TABLE "priority_area_submission" DROP COLUMN "upload_task_id"`, undefined);
        await queryRunner.query(`DROP TABLE "task"`, undefined);
        await queryRunner.query(`DROP TYPE "task_progress_type_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "task_state_enum"`, undefined);
    }

}
