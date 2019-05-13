import {MigrationInterface, QueryRunner} from "typeorm";

export class relationshipRequestToProj1557722679974 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project_metadata" ADD "hippRequestId" uuid`);
        await queryRunner.query(`ALTER TABLE "project_metadata" ADD CONSTRAINT "FK_8cc4115428f9962bdf33fc6a199" FOREIGN KEY ("hippRequestId") REFERENCES "hipp_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project_metadata" DROP CONSTRAINT "FK_8cc4115428f9962bdf33fc6a199"`);
        await queryRunner.query(`ALTER TABLE "project_metadata" DROP COLUMN "hippRequestId"`);
    }

}
