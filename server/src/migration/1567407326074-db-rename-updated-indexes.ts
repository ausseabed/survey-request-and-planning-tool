import {MigrationInterface, QueryRunner} from "typeorm";

export class dbRenameUpdatedIndexes1567407326074 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "survey_deliverable" DROP CONSTRAINT "FK_fc68a5c1b48e69d646436e4f365"`);
        await queryRunner.query(`ALTER TABLE "survey_plan_organisations_organisation" DROP CONSTRAINT "FK_800b5920e272f04dbf4010d4aab"`);
        await queryRunner.query(`ALTER TABLE "survey_plan_custodians_custodian" DROP CONSTRAINT "FK_b353f1abcf1b2356ed422038095"`);
        await queryRunner.query(`ALTER TABLE "survey_plan_data_capture_types_data_capture_type" DROP CONSTRAINT "FK_f0a3f2c223494647db8a83f93b3"`);
        await queryRunner.query(`ALTER TABLE "survey_plan_instrument_types_instrument_type" DROP CONSTRAINT "FK_c1edbe692c55585d565aaf3c416"`);
        await queryRunner.query(`ALTER TABLE "survey_request_custodians_custodian" DROP CONSTRAINT "FK_ed25c578bdb730cf6cee10e8805"`);
        await queryRunner.query(`ALTER TABLE "survey_request_organisations_organisation" DROP CONSTRAINT "FK_6ad43146afaab19f7da7ef99ab6"`);
        await queryRunner.query(`ALTER TABLE "survey_request_purposes_request_purpose" DROP CONSTRAINT "FK_5ea778571a2749bd7f01c1814ab"`);
        await queryRunner.query(`ALTER TABLE "survey_request_data_capture_types_data_capture_type" DROP CONSTRAINT "FK_b0a7562ceaf4129f21ff77e3c91"`);
        await queryRunner.query(`DROP INDEX "IDX_800b5920e272f04dbf4010d4aa"`);
        await queryRunner.query(`DROP INDEX "IDX_b353f1abcf1b2356ed42203809"`);
        await queryRunner.query(`DROP INDEX "IDX_f0a3f2c223494647db8a83f93b"`);
        await queryRunner.query(`DROP INDEX "IDX_c1edbe692c55585d565aaf3c41"`);
        await queryRunner.query(`DROP INDEX "IDX_ed25c578bdb730cf6cee10e880"`);
        await queryRunner.query(`DROP INDEX "IDX_6ad43146afaab19f7da7ef99ab"`);
        await queryRunner.query(`DROP INDEX "IDX_5ea778571a2749bd7f01c1814a"`);
        await queryRunner.query(`DROP INDEX "IDX_b0a7562ceaf4129f21ff77e3c9"`);
        await queryRunner.query(`CREATE INDEX "IDX_de6e6ad3d839ae73c69bb2d2f2" ON "survey_plan_organisations_organisation" ("surveyPlanId") `);
        await queryRunner.query(`CREATE INDEX "IDX_80f4ed252f46c96af0f46629cb" ON "survey_plan_custodians_custodian" ("surveyPlanId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d98cecec9414f8e7cde84ba2de" ON "survey_plan_data_capture_types_data_capture_type" ("surveyPlanId") `);
        await queryRunner.query(`CREATE INDEX "IDX_efb2073c278518a97753b91dfd" ON "survey_plan_instrument_types_instrument_type" ("surveyPlanId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c335a3d7c9ffeeb09f940cc943" ON "survey_request_custodians_custodian" ("surveyRequestId") `);
        await queryRunner.query(`CREATE INDEX "IDX_23d3d3dc36814c2908a0ca8582" ON "survey_request_organisations_organisation" ("surveyRequestId") `);
        await queryRunner.query(`CREATE INDEX "IDX_6ce0fecf9eebe7f95ca3eb0067" ON "survey_request_purposes_request_purpose" ("surveyRequestId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8fee8e8b6c831ae663921ecdad" ON "survey_request_data_capture_types_data_capture_type" ("surveyRequestId") `);
        await queryRunner.query(`ALTER TABLE "survey_deliverable" ADD CONSTRAINT "FK_a152bc64dcf2578fb3ad27682de" FOREIGN KEY ("surveyPlanId") REFERENCES "survey_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE "survey_plan_organisations_organisation" ADD CONSTRAINT "FK_de6e6ad3d839ae73c69bb2d2f28" FOREIGN KEY ("surveyPlanId") REFERENCES "survey_plan"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_plan_custodians_custodian" ADD CONSTRAINT "FK_80f4ed252f46c96af0f46629cbb" FOREIGN KEY ("surveyPlanId") REFERENCES "survey_plan"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_plan_data_capture_types_data_capture_type" ADD CONSTRAINT "FK_d98cecec9414f8e7cde84ba2def" FOREIGN KEY ("surveyPlanId") REFERENCES "survey_plan"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_plan_instrument_types_instrument_type" ADD CONSTRAINT "FK_efb2073c278518a97753b91dfd4" FOREIGN KEY ("surveyPlanId") REFERENCES "survey_plan"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_request_custodians_custodian" ADD CONSTRAINT "FK_c335a3d7c9ffeeb09f940cc9432" FOREIGN KEY ("surveyRequestId") REFERENCES "survey_request"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_request_organisations_organisation" ADD CONSTRAINT "FK_23d3d3dc36814c2908a0ca8582b" FOREIGN KEY ("surveyRequestId") REFERENCES "survey_request"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_request_purposes_request_purpose" ADD CONSTRAINT "FK_6ce0fecf9eebe7f95ca3eb0067b" FOREIGN KEY ("surveyRequestId") REFERENCES "survey_request"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_request_data_capture_types_data_capture_type" ADD CONSTRAINT "FK_8fee8e8b6c831ae663921ecdad4" FOREIGN KEY ("surveyRequestId") REFERENCES "survey_request"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "survey_request_data_capture_types_data_capture_type" DROP CONSTRAINT "FK_8fee8e8b6c831ae663921ecdad4"`);
        await queryRunner.query(`ALTER TABLE "survey_request_purposes_request_purpose" DROP CONSTRAINT "FK_6ce0fecf9eebe7f95ca3eb0067b"`);
        await queryRunner.query(`ALTER TABLE "survey_request_organisations_organisation" DROP CONSTRAINT "FK_23d3d3dc36814c2908a0ca8582b"`);
        await queryRunner.query(`ALTER TABLE "survey_request_custodians_custodian" DROP CONSTRAINT "FK_c335a3d7c9ffeeb09f940cc9432"`);
        await queryRunner.query(`ALTER TABLE "survey_plan_instrument_types_instrument_type" DROP CONSTRAINT "FK_efb2073c278518a97753b91dfd4"`);
        await queryRunner.query(`ALTER TABLE "survey_plan_data_capture_types_data_capture_type" DROP CONSTRAINT "FK_d98cecec9414f8e7cde84ba2def"`);
        await queryRunner.query(`ALTER TABLE "survey_plan_custodians_custodian" DROP CONSTRAINT "FK_80f4ed252f46c96af0f46629cbb"`);
        await queryRunner.query(`ALTER TABLE "survey_plan_organisations_organisation" DROP CONSTRAINT "FK_de6e6ad3d839ae73c69bb2d2f28"`);

        await queryRunner.query(`ALTER TABLE "survey_deliverable" DROP CONSTRAINT "FK_a152bc64dcf2578fb3ad27682de"`);
        await queryRunner.query(`DROP INDEX "IDX_8fee8e8b6c831ae663921ecdad"`);
        await queryRunner.query(`DROP INDEX "IDX_6ce0fecf9eebe7f95ca3eb0067"`);
        await queryRunner.query(`DROP INDEX "IDX_23d3d3dc36814c2908a0ca8582"`);
        await queryRunner.query(`DROP INDEX "IDX_c335a3d7c9ffeeb09f940cc943"`);
        await queryRunner.query(`DROP INDEX "IDX_efb2073c278518a97753b91dfd"`);
        await queryRunner.query(`DROP INDEX "IDX_d98cecec9414f8e7cde84ba2de"`);
        await queryRunner.query(`DROP INDEX "IDX_80f4ed252f46c96af0f46629cb"`);
        await queryRunner.query(`DROP INDEX "IDX_de6e6ad3d839ae73c69bb2d2f2"`);
        await queryRunner.query(`CREATE INDEX "IDX_b0a7562ceaf4129f21ff77e3c9" ON "survey_request_data_capture_types_data_capture_type" ("surveyRequestId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5ea778571a2749bd7f01c1814a" ON "survey_request_purposes_request_purpose" ("surveyRequestId") `);
        await queryRunner.query(`CREATE INDEX "IDX_6ad43146afaab19f7da7ef99ab" ON "survey_request_organisations_organisation" ("surveyRequestId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ed25c578bdb730cf6cee10e880" ON "survey_request_custodians_custodian" ("surveyRequestId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c1edbe692c55585d565aaf3c41" ON "survey_plan_instrument_types_instrument_type" ("surveyPlanId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f0a3f2c223494647db8a83f93b" ON "survey_plan_data_capture_types_data_capture_type" ("surveyPlanId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b353f1abcf1b2356ed42203809" ON "survey_plan_custodians_custodian" ("surveyPlanId") `);
        await queryRunner.query(`CREATE INDEX "IDX_800b5920e272f04dbf4010d4aa" ON "survey_plan_organisations_organisation" ("surveyPlanId") `);
        await queryRunner.query(`ALTER TABLE "survey_request_data_capture_types_data_capture_type" ADD CONSTRAINT "FK_b0a7562ceaf4129f21ff77e3c91" FOREIGN KEY ("surveyRequestId") REFERENCES "survey_request"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_request_purposes_request_purpose" ADD CONSTRAINT "FK_5ea778571a2749bd7f01c1814ab" FOREIGN KEY ("surveyRequestId") REFERENCES "survey_request"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_request_organisations_organisation" ADD CONSTRAINT "FK_6ad43146afaab19f7da7ef99ab6" FOREIGN KEY ("surveyRequestId") REFERENCES "survey_request"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_request_custodians_custodian" ADD CONSTRAINT "FK_ed25c578bdb730cf6cee10e8805" FOREIGN KEY ("surveyRequestId") REFERENCES "survey_request"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_plan_instrument_types_instrument_type" ADD CONSTRAINT "FK_c1edbe692c55585d565aaf3c416" FOREIGN KEY ("surveyPlanId") REFERENCES "survey_plan"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_plan_data_capture_types_data_capture_type" ADD CONSTRAINT "FK_f0a3f2c223494647db8a83f93b3" FOREIGN KEY ("surveyPlanId") REFERENCES "survey_plan"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_plan_custodians_custodian" ADD CONSTRAINT "FK_b353f1abcf1b2356ed422038095" FOREIGN KEY ("surveyPlanId") REFERENCES "survey_plan"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_plan_organisations_organisation" ADD CONSTRAINT "FK_800b5920e272f04dbf4010d4aab" FOREIGN KEY ("surveyPlanId") REFERENCES "survey_plan"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_deliverable" ADD CONSTRAINT "FK_fc68a5c1b48e69d646436e4f365" FOREIGN KEY ("surveyPlanId") REFERENCES "survey_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
