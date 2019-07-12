import {MigrationInterface, QueryRunner} from "typeorm";

export class roleAddCanViewRiskPriority1562806819071 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "role" ADD "canViewRiskPriority" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canViewRiskPriority"`);
    }

}
