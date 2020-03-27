import {MigrationInterface, QueryRunner} from "typeorm";

export class priorityAreas1585290446968 implements MigrationInterface {
    name = 'priorityAreas1585290446968'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "priority_area" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "preferredTimeframe" character varying, "riskRating" character varying, "requiredDataQuality" character varying, "dataImportance" character varying, "area_of_interest" geometry(MultiPolygon,4326), "priorityAreaSubmissionSubmissionId" uuid, CONSTRAINT "PK_3fcc563c964052f0d2258bc607a" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "priority_area_submission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "contactPerson" character varying, "contactEmail" character varying, "citation" boolean, "citedContactName" character varying, "citedContactEmail" character varying, "riskIssues" character varying, "furtherInformation" character varying, "submittingOrganisationId" uuid, "citedOrganisationId" uuid, "custodianId" uuid, "recordStateId" uuid, CONSTRAINT "REL_cc2c9c0f1f540414fe61c54219" UNIQUE ("recordStateId"), CONSTRAINT "PK_24bbea9830d394c5abe3724fb93" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "priority_area" ADD CONSTRAINT "FK_4279278a0057dc169c70e2876d5" FOREIGN KEY ("priorityAreaSubmissionSubmissionId") REFERENCES "priority_area_submission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "priority_area_submission" ADD CONSTRAINT "FK_c57240f63e03bdd463fe7e2da08" FOREIGN KEY ("submittingOrganisationId") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "priority_area_submission" ADD CONSTRAINT "FK_8ff26124f0549623100c8e5c51d" FOREIGN KEY ("citedOrganisationId") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "priority_area_submission" ADD CONSTRAINT "FK_c3c87224e5a0f37ad874ad179ae" FOREIGN KEY ("custodianId") REFERENCES "custodian"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "priority_area_submission" ADD CONSTRAINT "FK_cc2c9c0f1f540414fe61c542198" FOREIGN KEY ("recordStateId") REFERENCES "record_state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "priority_area_submission" DROP CONSTRAINT "FK_cc2c9c0f1f540414fe61c542198"`, undefined);
        await queryRunner.query(`ALTER TABLE "priority_area_submission" DROP CONSTRAINT "FK_c3c87224e5a0f37ad874ad179ae"`, undefined);
        await queryRunner.query(`ALTER TABLE "priority_area_submission" DROP CONSTRAINT "FK_8ff26124f0549623100c8e5c51d"`, undefined);
        await queryRunner.query(`ALTER TABLE "priority_area_submission" DROP CONSTRAINT "FK_c57240f63e03bdd463fe7e2da08"`, undefined);
        await queryRunner.query(`ALTER TABLE "priority_area" DROP CONSTRAINT "FK_4279278a0057dc169c70e2876d5"`, undefined);
        await queryRunner.query(`DROP TABLE "priority_area_submission"`, undefined);
        await queryRunner.query(`DROP TABLE "priority_area"`, undefined);
    }

}
