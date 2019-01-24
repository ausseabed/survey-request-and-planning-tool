import {MigrationInterface, QueryRunner} from "typeorm";

export class deliveryMethodsToArray1548305220751 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tech_spec" RENAME COLUMN "deliveryMethod" TO "deliveryMethods"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "deliveryMethods"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "deliveryMethods" text NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "deliveryMethods"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "deliveryMethods" character varying NOT NULL DEFAULT 'default'`);
        await queryRunner.query(`ALTER TABLE "tech_spec" RENAME COLUMN "deliveryMethods" TO "deliveryMethod"`);
    }

}
