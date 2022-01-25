import { MigrationInterface, QueryRunner } from "typeorm";

export class userCreated1643082876513 implements MigrationInterface {
    name = 'userCreated1643082876513'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created"`);
    }

}
