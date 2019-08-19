import {MigrationInterface, QueryRunner} from "typeorm";

export class fixBadOrgConstraint1565665049628 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      // The constraint was not updated previously when the organisation table
      // was renamed to custodian. This fixes that.

      // this table is full of references to custodians, not orgs. These
      // must be removed before constraint can be changed.
      await queryRunner.manager.createQueryBuilder()
      .delete()
      .from("project_metadata_organisations_organisation")
      .execute();

      await queryRunner.query(`ALTER TABLE "project_metadata_organisations_organisation" DROP CONSTRAINT "FK_2d37249970bb3f672734a409976"`);
      await queryRunner.query(`ALTER TABLE "project_metadata_organisations_organisation" ADD CONSTRAINT "FK_2d37249970bb3f672734a409976" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
