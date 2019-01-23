import {MigrationInterface, QueryRunner} from "typeorm";

export class addedMissingGroundTruthingOtherAttrib1548281925523 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "groundTruthingMethodOther" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "groundTruthingMethodOther"`);
    }

}
