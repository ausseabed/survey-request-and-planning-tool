import {MigrationInterface, QueryRunner} from "typeorm";

export class addedProjectMetadataVessel1547168456243 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project_metadata" ADD "vessel" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project_metadata" DROP COLUMN "vessel"`);
    }

}
