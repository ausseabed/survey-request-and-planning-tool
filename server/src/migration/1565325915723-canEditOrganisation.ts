import {MigrationInterface, QueryRunner} from "typeorm";

export class canEditOrganisation1565325915723 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "role" ADD "canEditOrganisation" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canEditOrganisation"`);
    }

}
