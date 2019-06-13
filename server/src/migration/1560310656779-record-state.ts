import {MigrationInterface, QueryRunner} from "typeorm";

export class recordState1560310656779 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "record_state" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "state" character varying NOT NULL, "created" TIMESTAMP WITH TIME ZONE, "version" integer, "userId" character varying, "previousId" uuid, CONSTRAINT "REL_c5e093eaddf143591c15efd977" UNIQUE ("previousId"), CONSTRAINT "PK_87bfc48962d11ba818fee63814e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "hipp_request" ADD "recordStateId" uuid`);
        await queryRunner.query(`ALTER TABLE "hipp_request" ADD CONSTRAINT "UQ_d8117b4143af8efdc7f4803ed18" UNIQUE ("recordStateId")`);
        await queryRunner.query(`ALTER TABLE "project_metadata" ADD "recordStateId" uuid`);
        await queryRunner.query(`ALTER TABLE "project_metadata" ADD CONSTRAINT "UQ_f2d2ecb42e9fdc33937c812201f" UNIQUE ("recordStateId")`);

        await queryRunner.query(`ALTER TABLE "record_state" ADD CONSTRAINT "FK_166799e2fc3670a1481b9b8c0ec" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "record_state" ADD CONSTRAINT "FK_c5e093eaddf143591c15efd977f" FOREIGN KEY ("previousId") REFERENCES "record_state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hipp_request" ADD CONSTRAINT "FK_d8117b4143af8efdc7f4803ed18" FOREIGN KEY ("recordStateId") REFERENCES "record_state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_metadata" ADD CONSTRAINT "FK_f2d2ecb42e9fdc33937c812201f" FOREIGN KEY ("recordStateId") REFERENCES "record_state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project_metadata" DROP CONSTRAINT "FK_f2d2ecb42e9fdc33937c812201f"`);
        await queryRunner.query(`ALTER TABLE "hipp_request" DROP CONSTRAINT "FK_d8117b4143af8efdc7f4803ed18"`);
        await queryRunner.query(`ALTER TABLE "record_state" DROP CONSTRAINT "FK_c5e093eaddf143591c15efd977f"`);
        await queryRunner.query(`ALTER TABLE "record_state" DROP CONSTRAINT "FK_166799e2fc3670a1481b9b8c0ec"`);

        await queryRunner.query(`ALTER TABLE "project_metadata" DROP CONSTRAINT "UQ_f2d2ecb42e9fdc33937c812201f"`);
        await queryRunner.query(`ALTER TABLE "project_metadata" DROP COLUMN "recordStateId"`);
        await queryRunner.query(`ALTER TABLE "hipp_request" DROP CONSTRAINT "UQ_d8117b4143af8efdc7f4803ed18"`);
        await queryRunner.query(`ALTER TABLE "hipp_request" DROP COLUMN "recordStateId"`);
        await queryRunner.query(`DROP TABLE "record_state"`);
    }

}
