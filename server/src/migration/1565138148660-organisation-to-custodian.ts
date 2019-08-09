import {MigrationInterface, QueryRunner} from "typeorm";

export class organisationToCustodian1565138148660 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_642763a1acbc9672d38429ea62a"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "organisationId" TO "custodianId"`);
        await queryRunner.query(`ALTER TABLE "organisation" RENAME TO "custodian"`);

        await queryRunner.query(`CREATE TABLE "project_metadata_custodians_custodian" ("projectMetadataId" uuid NOT NULL, "custodianId" uuid NOT NULL, CONSTRAINT "PK_609ec809859b7fe51e33ce2213b" PRIMARY KEY ("projectMetadataId", "custodianId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_55b78489d0c93a4f490147c7d1" ON "project_metadata_custodians_custodian" ("projectMetadataId") `);
        await queryRunner.query(`CREATE INDEX "IDX_59242350d8efa406e98642e3d3" ON "project_metadata_custodians_custodian" ("custodianId") `);
        await queryRunner.query(`CREATE TABLE "hipp_request_requesting_agencies_custodian" ("hippRequestId" uuid NOT NULL, "custodianId" uuid NOT NULL, CONSTRAINT "PK_ebc9c594635111d42b9df5525d3" PRIMARY KEY ("hippRequestId", "custodianId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d20d2463a5145ad2d6232b0c10" ON "hipp_request_requesting_agencies_custodian" ("hippRequestId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ea61f51e3d2ed7f772e4873b9c" ON "hipp_request_requesting_agencies_custodian" ("custodianId") `);
        await queryRunner.query(`ALTER TABLE "role" RENAME COLUMN "canEditOrganisation" TO "canEditCustodian"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME COLUMN "canViewOrgProjects" TO "canViewCustodianProjects"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME COLUMN "canEditOrgProjects" TO "canEditCustodianProjects"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME COLUMN "canViewOrgHippRequests" TO "canViewCustodianHippRequests"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME COLUMN "canEditOrgHippRequests" TO "canEditCustodianHippRequests"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME COLUMN "canViewOrgAttachments" TO "canViewCustodianAttachments"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME COLUMN "canUploadOrgAttachments" TO "canUploadCustodianAttachments"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME COLUMN "canDeleteOrgAttachments" TO "canDeleteCustodianAttachments"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME COLUMN "canFinaliseOrgRecordState" TO "canFinaliseCustodianRecordState"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME COLUMN "canReviseOrgRecordState" TO "canReviseCustodianRecordState"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME COLUMN "canAcceptOrgRecordState" TO "canAcceptCustodianRecordState"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME COLUMN "canRemoveOrgRecordState" TO "canRemoveCustodianRecordState"`);

        await queryRunner.query(`ALTER TABLE "survey_application" ALTER COLUMN "deleted" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ALTER COLUMN "timeSensitive" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ALTER COLUMN "groundTruthing" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ALTER COLUMN "overlap" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ALTER COLUMN "swathWidth" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ALTER COLUMN "horizontalAccuracy" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ALTER COLUMN "verticalAccuracy" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ALTER COLUMN "horizontalReferenceSystem" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ALTER COLUMN "verticalReferenceSystem" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ALTER COLUMN "soundingDatum" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ALTER COLUMN "spheroid" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ALTER COLUMN "deliveryMethods" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ALTER COLUMN "deliveryRequirements" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ALTER COLUMN "tidalGaugeLocations" TYPE geometry(MultiPoint,4326)`);
        await queryRunner.query(`ALTER TABLE "project_metadata_data_capture_types_data_capture_type" DROP CONSTRAINT "FK_45a1c9cec861bdcd6d6cd1b4b27"`);
        await queryRunner.query(`ALTER TABLE "project_metadata_instrument_types_instrument_type" DROP CONSTRAINT "FK_ea20802d04daad872be4944ee1a"`);
        await queryRunner.query(`ALTER TABLE "survey_deliverable" DROP CONSTRAINT "FK_fc68a5c1b48e69d646436e4f365"`);
        await queryRunner.query(`ALTER TABLE "survey_attachment" DROP CONSTRAINT "FK_b89fa7c28c7243f9daac9bb5172"`);
        await queryRunner.query(`ALTER TABLE "project_metadata" ADD CONSTRAINT "UQ_9748d5c1a2a213c7cf912fcd9d8" UNIQUE ("id")`);
        await queryRunner.query(`ALTER TABLE "project_metadata" ALTER COLUMN "areaOfInterest" TYPE geometry(MultiPolygon,4326)`);
        await queryRunner.query(`ALTER TABLE "hipp_request" ALTER COLUMN "areaOfInterest" TYPE geometry(MultiPolygon,4326)`);
        await queryRunner.query(`CREATE INDEX "IDX_45a1c9cec861bdcd6d6cd1b4b2" ON "project_metadata_data_capture_types_data_capture_type" ("projectMetadataId") `);
        await queryRunner.query(`CREATE INDEX "IDX_bf46d2f4f6c38f12dfc9ba60c8" ON "project_metadata_data_capture_types_data_capture_type" ("dataCaptureTypeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ea20802d04daad872be4944ee1" ON "project_metadata_instrument_types_instrument_type" ("projectMetadataId") `);
        await queryRunner.query(`CREATE INDEX "IDX_148de403c76d40665fcdd354e8" ON "project_metadata_instrument_types_instrument_type" ("instrumentTypeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_666945661b4fa522b2e2f7018f" ON "instrument_type_data_capture_types_data_capture_type" ("instrumentTypeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c12b91e6c359e63a1cae8f36ec" ON "instrument_type_data_capture_types_data_capture_type" ("dataCaptureTypeId") `);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_7433171b042f7418781c70a7b0b" FOREIGN KEY ("custodianId") REFERENCES "custodian"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_deliverable" ADD CONSTRAINT "FK_fc68a5c1b48e69d646436e4f365" FOREIGN KEY ("projectMetadataId") REFERENCES "project_metadata"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_attachment" ADD CONSTRAINT "FK_b89fa7c28c7243f9daac9bb5172" FOREIGN KEY ("entityId") REFERENCES "project_metadata"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        //await queryRunner.query(`ALTER TABLE "project_metadata" ADD CONSTRAINT "FK_9748d5c1a2a213c7cf912fcd9d8" FOREIGN KEY ("id") REFERENCES "tech_spec"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_metadata_custodians_custodian" ADD CONSTRAINT "FK_55b78489d0c93a4f490147c7d12" FOREIGN KEY ("projectMetadataId") REFERENCES "project_metadata"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_metadata_custodians_custodian" ADD CONSTRAINT "FK_59242350d8efa406e98642e3d37" FOREIGN KEY ("custodianId") REFERENCES "custodian"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_metadata_data_capture_types_data_capture_type" ADD CONSTRAINT "FK_45a1c9cec861bdcd6d6cd1b4b27" FOREIGN KEY ("projectMetadataId") REFERENCES "project_metadata"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_metadata_instrument_types_instrument_type" ADD CONSTRAINT "FK_ea20802d04daad872be4944ee1a" FOREIGN KEY ("projectMetadataId") REFERENCES "project_metadata"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hipp_request_requesting_agencies_custodian" ADD CONSTRAINT "FK_d20d2463a5145ad2d6232b0c101" FOREIGN KEY ("hippRequestId") REFERENCES "hipp_request"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hipp_request_requesting_agencies_custodian" ADD CONSTRAINT "FK_ea61f51e3d2ed7f772e4873b9c8" FOREIGN KEY ("custodianId") REFERENCES "custodian"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "hipp_request_requesting_agencies_custodian" DROP CONSTRAINT "FK_ea61f51e3d2ed7f772e4873b9c8"`);
        await queryRunner.query(`ALTER TABLE "hipp_request_requesting_agencies_custodian" DROP CONSTRAINT "FK_d20d2463a5145ad2d6232b0c101"`);
        await queryRunner.query(`ALTER TABLE "project_metadata_instrument_types_instrument_type" DROP CONSTRAINT "FK_ea20802d04daad872be4944ee1a"`);
        await queryRunner.query(`ALTER TABLE "project_metadata_data_capture_types_data_capture_type" DROP CONSTRAINT "FK_45a1c9cec861bdcd6d6cd1b4b27"`);
        await queryRunner.query(`ALTER TABLE "project_metadata_custodians_custodian" DROP CONSTRAINT "FK_59242350d8efa406e98642e3d37"`);
        await queryRunner.query(`ALTER TABLE "project_metadata_custodians_custodian" DROP CONSTRAINT "FK_55b78489d0c93a4f490147c7d12"`);
        //await queryRunner.query(`ALTER TABLE "project_metadata" DROP CONSTRAINT "FK_9748d5c1a2a213c7cf912fcd9d8"`);
        await queryRunner.query(`ALTER TABLE "survey_attachment" DROP CONSTRAINT "FK_b89fa7c28c7243f9daac9bb5172"`);
        await queryRunner.query(`ALTER TABLE "survey_deliverable" DROP CONSTRAINT "FK_fc68a5c1b48e69d646436e4f365"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_7433171b042f7418781c70a7b0b"`);
        await queryRunner.query(`DROP INDEX "IDX_c12b91e6c359e63a1cae8f36ec"`);
        await queryRunner.query(`DROP INDEX "IDX_666945661b4fa522b2e2f7018f"`);
        await queryRunner.query(`DROP INDEX "IDX_148de403c76d40665fcdd354e8"`);
        await queryRunner.query(`DROP INDEX "IDX_ea20802d04daad872be4944ee1"`);
        await queryRunner.query(`DROP INDEX "IDX_bf46d2f4f6c38f12dfc9ba60c8"`);
        await queryRunner.query(`DROP INDEX "IDX_45a1c9cec861bdcd6d6cd1b4b2"`);
        await queryRunner.query(`ALTER TABLE "hipp_request" ALTER COLUMN "areaOfInterest" TYPE geometry(MULTILINESTRING,4326)`);
        await queryRunner.query(`ALTER TABLE "project_metadata" ALTER COLUMN "areaOfInterest" TYPE geometry(MULTILINESTRING,4326)`);
        await queryRunner.query(`ALTER TABLE "project_metadata" DROP CONSTRAINT "UQ_9748d5c1a2a213c7cf912fcd9d8"`);
        await queryRunner.query(`ALTER TABLE "survey_attachment" ADD CONSTRAINT "FK_b89fa7c28c7243f9daac9bb5172" FOREIGN KEY ("entityId") REFERENCES "project_metadata"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_deliverable" ADD CONSTRAINT "FK_fc68a5c1b48e69d646436e4f365" FOREIGN KEY ("projectMetadataId") REFERENCES "project_metadata"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_metadata_instrument_types_instrument_type" ADD CONSTRAINT "FK_ea20802d04daad872be4944ee1a" FOREIGN KEY ("projectMetadataId") REFERENCES "project_metadata"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_metadata_data_capture_types_data_capture_type" ADD CONSTRAINT "FK_45a1c9cec861bdcd6d6cd1b4b27" FOREIGN KEY ("projectMetadataId") REFERENCES "project_metadata"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ALTER COLUMN "tidalGaugeLocations" TYPE geometry(MULTILINESTRING,4326)`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ALTER COLUMN "deliveryRequirements" SET DEFAULT 'default'`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ALTER COLUMN "deliveryMethods" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ALTER COLUMN "spheroid" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ALTER COLUMN "soundingDatum" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ALTER COLUMN "verticalReferenceSystem" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ALTER COLUMN "horizontalReferenceSystem" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ALTER COLUMN "verticalAccuracy" SET DEFAULT 'default'`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ALTER COLUMN "horizontalAccuracy" SET DEFAULT 'default'`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ALTER COLUMN "swathWidth" SET DEFAULT 'default'`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ALTER COLUMN "overlap" SET DEFAULT 'default'`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ALTER COLUMN "groundTruthing" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ALTER COLUMN "timeSensitive" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "survey_application" ALTER COLUMN "deleted" SET DEFAULT false`);

        await queryRunner.query(`ALTER TABLE "role" RENAME COLUMN "canEditCustodian" TO "canEditOrganisation"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME COLUMN "canViewCustodianProjects" TO "canViewOrgProjects"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME COLUMN "canEditCustodianProjects" TO "canEditOrgProjects"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME COLUMN "canViewCustodianHippRequests" TO "canViewOrgHippRequests"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME COLUMN "canEditCustodianHippRequests" TO "canEditOrgHippRequests"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME COLUMN "canViewCustodianAttachments" TO "canViewOrgAttachments"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME COLUMN "canUploadCustodianAttachments" TO "canUploadOrgAttachments"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME COLUMN "canDeleteCustodianAttachments" TO "canDeleteOrgAttachments"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME COLUMN "canFinaliseCustodianRecordState" TO "canFinaliseOrgRecordState"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME COLUMN "canReviseCustodianRecordState" TO "canReviseOrgRecordState"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME COLUMN "canAcceptCustodianRecordState" TO "canAcceptOrgRecordState"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME COLUMN "canRemoveCustodianRecordState" TO "canRemoveOrgRecordState"`);

        await queryRunner.query(`DROP INDEX "IDX_ea61f51e3d2ed7f772e4873b9c"`);
        await queryRunner.query(`DROP INDEX "IDX_d20d2463a5145ad2d6232b0c10"`);
        await queryRunner.query(`DROP TABLE "hipp_request_requesting_agencies_custodian"`);
        await queryRunner.query(`DROP INDEX "IDX_59242350d8efa406e98642e3d3"`);
        await queryRunner.query(`DROP INDEX "IDX_55b78489d0c93a4f490147c7d1"`);
        await queryRunner.query(`DROP TABLE "project_metadata_custodians_custodian"`);

        await queryRunner.query(`ALTER TABLE "custodian" RENAME TO "organisation"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "custodianId" TO "organisationId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_642763a1acbc9672d38429ea62a" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
