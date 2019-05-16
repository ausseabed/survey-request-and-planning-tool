import {MigrationInterface, QueryRunner} from "typeorm";

export class mimeTypeInReportTemplates1557981812219 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "report_template" ADD "mimeType" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "report_template" DROP COLUMN "mimeType"`);
    }

}
