import { MigrationInterface, QueryRunner } from "typeorm";

export class paIntersections1644732831703 implements MigrationInterface {
    name = 'paIntersections1644732831703'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area" ADD "intersections" text DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "priority_area" DROP COLUMN "intersections"`);
    }

}
