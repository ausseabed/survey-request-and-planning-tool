import {MigrationInterface, QueryRunner} from "typeorm";

export class userOrgsRelationship1558760501570 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ADD "organisationId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_642763a1acbc9672d38429ea62a" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_642763a1acbc9672d38429ea62a"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "organisationId"`);
    }

}
