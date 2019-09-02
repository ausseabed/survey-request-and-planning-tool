import {MigrationInterface, QueryRunner} from "typeorm";

export class organisatinoAbbreviation1567467257083 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "organisation" ADD "abbreviation" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "organisation" DROP COLUMN "abbreviation"`);
    }

}
