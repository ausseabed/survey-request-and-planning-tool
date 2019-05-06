import {MigrationInterface, QueryRunner} from "typeorm";

export class multipleGroundTruthMethods1557109814176 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "groundTruthingMethod"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "groundTruthingMethod" text NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "groundTruthingMethod"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "groundTruthingMethod" character varying`);
    }

}
