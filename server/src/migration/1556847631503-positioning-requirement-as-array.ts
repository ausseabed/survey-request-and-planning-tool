import {MigrationInterface, QueryRunner} from "typeorm";

export class positioningRequirementAsArray1556847631503 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "positioningRequirement"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "positioningRequirement" text NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "positioningRequirement"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "positioningRequirement" character varying`);
    }

}
