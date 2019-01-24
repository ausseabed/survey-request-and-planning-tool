import {MigrationInterface, QueryRunner} from "typeorm";

export class fixTechspecBadColumnNames1548371374675 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "horizontalRefefenceSystem"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "verticalRefefenceSystem"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "horizontalReferenceSystem" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "verticalReferenceSystem" integer NOT NULL DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "soundingDatum"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "soundingDatum" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "spheroid"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "spheroid" integer NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "spheroid"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "spheroid" character varying NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "soundingDatum"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "soundingDatum" character varying NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "verticalReferenceSystem"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "horizontalReferenceSystem"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "verticalRefefenceSystem" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "horizontalRefefenceSystem" integer NOT NULL DEFAULT 0`);
    }

}
