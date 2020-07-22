import {MigrationInterface, QueryRunner} from "typeorm";

export class requestPrimaryOrg1595316534740 implements MigrationInterface {
    name = 'requestPrimaryOrg1595316534740'

    public async up(queryRunner: QueryRunner): Promise<void> {

        const tablesToDrop = [
          "survey_request_requesting_agencies_organisation",
          "survey_request_requesting_agencies_custodian",
          "survey_request_purposes_request_purpose",
          "survey_request_organisations_organisation",
          "survey_request_data_capture_types_data_capture_type",
          "survey_request_custodians_custodian",
          "survey_request_attachment",
          "survey_request"
        ];

        for (const tableName of tablesToDrop) {
          await queryRunner.manager.createQueryBuilder()
          .delete()
          .from(tableName)
          .execute();
        }

        await queryRunner.query(`ALTER TABLE "survey_request" ADD "organisation_id" uuid`);
        await queryRunner.query(`ALTER TABLE "survey_request" ADD CONSTRAINT "UQ_7abd3f74fea03161b55962603ae" UNIQUE ("organisation_id")`);
        await queryRunner.query(`ALTER TABLE "survey_request" ADD CONSTRAINT "FK_7abd3f74fea03161b55962603ae" FOREIGN KEY ("organisation_id") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_request" DROP CONSTRAINT "FK_7abd3f74fea03161b55962603ae"`);
        await queryRunner.query(`ALTER TABLE "survey_request" DROP CONSTRAINT "UQ_7abd3f74fea03161b55962603ae"`);
        await queryRunner.query(`ALTER TABLE "survey_request" DROP COLUMN "organisation_id"`);
    }

}
