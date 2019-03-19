import {MigrationInterface, QueryRunner} from "typeorm";

export class addedSurveyApplication1547428748672 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "survey_application" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "group" character varying NOT NULL, CONSTRAINT "PK_dc0e149c86382c23d39ce83f28b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "survey_application_project_metadatas_project_metadata" ("surveyApplicationId" uuid NOT NULL, "projectMetadataId" uuid NOT NULL, CONSTRAINT "PK_a319f04a89c50885708b0d9918f" PRIMARY KEY ("surveyApplicationId", "projectMetadataId"))`);
        await queryRunner.query(`CREATE TABLE "project_metadata_applications_survey_application" ("projectMetadataId" uuid NOT NULL, "surveyApplicationId" uuid NOT NULL, CONSTRAINT "PK_9e5d72d04ad08b484ee673ebd94" PRIMARY KEY ("projectMetadataId", "surveyApplicationId"))`);
        await queryRunner.query(`ALTER TABLE "survey_technical_specifications" DROP CONSTRAINT "FK_b3bdf23f4179f65f54bad04a3a3"`);
        await queryRunner.query(`ALTER TABLE "survey_technical_specifications_surveyors_organisation" DROP CONSTRAINT "FK_627ade33bb2b939c2845a893e55"`);
        await queryRunner.query(`ALTER TABLE "survey_technical_specifications" ADD CONSTRAINT "UQ_b3bdf23f4179f65f54bad04a3a3" UNIQUE ("projectMetadataId")`);
        await queryRunner.query(`ALTER TABLE "survey_technical_specifications" ADD CONSTRAINT "FK_b3bdf23f4179f65f54bad04a3a3" FOREIGN KEY ("projectMetadataId") REFERENCES "project_metadata"("id")`);
        await queryRunner.query(`ALTER TABLE "survey_technical_specifications_surveyors_organisation" ADD CONSTRAINT "FK_627ade33bb2b939c2845a893e55" FOREIGN KEY ("surveyTechnicalSpecificationsProjectMetadataId") REFERENCES "survey_technical_specifications"("projectMetadataId") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "survey_application_project_metadatas_project_metadata" ADD CONSTRAINT "FK_077ac955d52e5591a80b52dba12" FOREIGN KEY ("surveyApplicationId") REFERENCES "survey_application"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "survey_application_project_metadatas_project_metadata" ADD CONSTRAINT "FK_de964b6274e24cef11cba3bf2dc" FOREIGN KEY ("projectMetadataId") REFERENCES "project_metadata"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_metadata_applications_survey_application" ADD CONSTRAINT "FK_82365d73aa0e0d6c6916923a7af" FOREIGN KEY ("projectMetadataId") REFERENCES "project_metadata"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_metadata_applications_survey_application" ADD CONSTRAINT "FK_c140bc542f3b1dccdf990190abf" FOREIGN KEY ("surveyApplicationId") REFERENCES "survey_application"("id") ON DELETE CASCADE`);

        // // seed database with default survey applications
        // for (const ad of applicationData) {
        //   await queryRunner
        //    .manager
        //    .createQueryBuilder()
        //    .insert()
        //    .into("survey_application")
        //    .values({
        //      name:ad.name,
        //      group:ad.group,
        //    })
        //    .execute();
        // }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project_metadata_applications_survey_application" DROP CONSTRAINT "FK_c140bc542f3b1dccdf990190abf"`);
        await queryRunner.query(`ALTER TABLE "project_metadata_applications_survey_application" DROP CONSTRAINT "FK_82365d73aa0e0d6c6916923a7af"`);
        await queryRunner.query(`ALTER TABLE "survey_application_project_metadatas_project_metadata" DROP CONSTRAINT "FK_de964b6274e24cef11cba3bf2dc"`);
        await queryRunner.query(`ALTER TABLE "survey_application_project_metadatas_project_metadata" DROP CONSTRAINT "FK_077ac955d52e5591a80b52dba12"`);
        await queryRunner.query(`ALTER TABLE "survey_technical_specifications_surveyors_organisation" DROP CONSTRAINT "FK_627ade33bb2b939c2845a893e55"`);
        await queryRunner.query(`ALTER TABLE "survey_technical_specifications" DROP CONSTRAINT "FK_b3bdf23f4179f65f54bad04a3a3"`);
        await queryRunner.query(`ALTER TABLE "survey_technical_specifications" DROP CONSTRAINT "UQ_b3bdf23f4179f65f54bad04a3a3"`);
        await queryRunner.query(`ALTER TABLE "survey_technical_specifications_surveyors_organisation" ADD CONSTRAINT "FK_627ade33bb2b939c2845a893e55" FOREIGN KEY ("surveyTechnicalSpecificationsProjectMetadataId") REFERENCES "survey_technical_specifications"("projectMetadataId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_technical_specifications" ADD CONSTRAINT "FK_b3bdf23f4179f65f54bad04a3a3" FOREIGN KEY ("projectMetadataId") REFERENCES "project_metadata"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "project_metadata_applications_survey_application"`);
        await queryRunner.query(`DROP TABLE "survey_application_project_metadatas_project_metadata"`);
        await queryRunner.query(`DROP TABLE "survey_application"`);
    }

}

const applicationData = [
 {
   "name": "Assessment of interferometric SAS as a bathymetric tool",
   "group": "Hydrographic charting"
 },
 {
   "name": "bathymetric model in support of hydrodynamic modelling",
   "group": "Hydrodynamic modelling"
 },
 {
   "name": "Coastal hazard modelling ",
   "group": "Natural disaster and hazard mitigation"
 },
 {
   "name": "changing bathymetry in the surfzone and nearshore",
   "group": "Storm surge modelling and impact"
 },
 {
   "name": "Collecting and processing ALB data",
   "group": "Data collection and acquisition"
 },
 {
   "name": "Compartment mapping",
   "group": "Seafloor type mapping"
 },
 {
   "name": "Corner Inlet Entrance Survey",
   "group": "Maritime navigation (Inc. leisure sailing and boating)"
 },
 {
   "name": "Depth monitoring",
   "group": "identification of shoals or obstructions"
 },
 {
   "name": "Dredge support and channel monitoring",
   "group": "Data collection and acquisition"
 },
 {
   "name": "Dredging support",
   "group": "Marine construction and infrastructure (Inc. cables etc.)"
 },
 {
   "name": "Dredging survey",
   "group": "Other (please specify)"
 },
 {
   "name": "Extended Continental Shelf (ECS) Mapping",
   "group": "Other (please specify)"
 },
 {
   "name": "Evaluation of sediment flux (accumulation vs erosion) and the effect of marine infrastructure",
   "group": "Other (please specify)"
 },
 {
   "name": "exploratory mapping",
   "group": "Seafloor type mapping"
 },
 {
   "name": "Full ocean depth multibeam system",
   "group": "Mineral resource (Inc. oil and gas)"
 },
 {
   "name": "geological and habitat mapping",
   "group": "Marine habitat mapping"
 },
 {
   "name": "Geophysical Mapping in Petermann 2015 Expedition",
   "group": "Other (please specify)"
 },
 {
   "name": "Habitat Mapping",
   "group": "Seafloor type mapping"
 },
 {
   "name": "Habitat mapping",
   "group": "Marine habitat mapping"
 },
 {
   "name": "Habitat Mapping",
   "group": "Ecosystem Modelling"
 },
 {
   "name": "habitat mapping",
   "group": "Marine habitat mapping"
 },
 {
   "name": "Reef detection",
   "group": "Marine habitat mapping"
 },
 {
   "name": "Habitat mapping",
   "group": "Marine habitat mapping"
 },
 {
   "name": "Habitat mapping",
   "group": "Marine habitat mapping"
 },
 {
   "name": "Habitat mapping",
   "group": "Marine habitat mapping"
 },
 {
   "name": "habitat mapping",
   "group": "Marine habitat mapping"
 },
 {
   "name": "Habitat Mapping",
   "group": "Marine habitat mapping"
 },
 {
   "name": "habitat mapping and resource assessment",
   "group": "Marine habitat mapping"
 },
 {
   "name": "habitat mapping, bathymetry",
   "group": "Marine habitat mapping"
 },
 {
   "name": "Habitat mapping, hydrodynamic modelling, predator foraging models",
   "group": "Commercial fishing and aquaculture"
 },
 {
   "name": "Hydrographic charting",
   "group": "Hydrographic charting"
 },
 {
   "name": "Hydrographic Charting",
   "group": "Hydrographic charting"
 },
 {
   "name": "Hydrographic charting",
   "group": "Hydrographic charting"
 },
 {
   "name": "Coastal hazard and risk assessment",
   "group": "Coastal zone management"
 },
 {
   "name": "Identifying foot of slope points (FOS) for Extended Continental Shelf",
   "group": "Seafloor type mapping"
 },
 {
   "name": "Nautical charting",
   "group": "Hydrographic charting"
 },
 {
   "name": "Mapping bathymetric changes through time",
   "group": "Other (please specify)"
 },
 {
   "name": "Mapping of active submarine faults",
   "group": "Natural disaster and hazard mitigation"
 },
 {
   "name": "Mapping scallop habitats",
   "group": "Commercial fishing and aquaculture"
 },
 {
   "name": "mapping seabed habitats",
   "group": "Seafloor type mapping"
 },
 {
   "name": "marina survey",
   "group": "Maritime navigation (Inc. leisure sailing and boating)"
 },
 {
   "name": "marine geological science research",
   "group": "Seafloor type mapping"
 },
 {
   "name": "Marine park monitoring and managment",
   "group": "Marine habitat mapping"
 },
 {
   "name": "Nautical charting",
   "group": "Hydrographic charting"
 },
 {
   "name": "Nautical charting",
   "group": "Hydrographic charting"
 },
 {
   "name": "Nautical Charting",
   "group": "Hydrographic charting"
 },
 {
   "name": "Nautical charting",
   "group": "Hydrographic charting"
 },
 {
   "name": "Nautical charting project",
   "group": "Hydrographic charting"
 },
 {
   "name": "Navigation Charting",
   "group": "Other (please specify)"
 },
 {
   "name": "Navigation charting",
   "group": "Hydrographic charting"
 },
 {
   "name": "Offshore geological mapping",
   "group": "Other (please specify)"
 },
 {
   "name": "Pipeline Survey",
   "group": "Marine construction and infrastructure (Inc. cables etc.)"
 },
 {
   "name": "Plane wreck survey",
   "group": "Identifying wrecks and dives (Inc. leisure dives)"
 },
 {
   "name": "Dredging Maintenance Surveys\n(Port management)",
   "group": "Maritime navigation (Inc. leisure sailing and boating)"
 },
 {
   "name": "Port Maintenance ",
   "group": "Seafloor type mapping"
 },
 {
   "name": "Hydrographic Survey\n(Port management)",
   "group": "Hydrographic charting"
 },
 {
   "name": "Under keel clearance \n(Port management)",
   "group": "Hydrographic charting"
 },
 {
   "name": "Hydrographic Survey\n(Queen Charlotte Sound & Tory Channel)",
   "group": "Hydrographic charting"
 },
 {
   "name": "Reference surfaces for Airborn LiDAR Bathymetry (ALB) surveys",
   "group": "Data collection and acquisition"
 },
 {
   "name": "safety of navigation surveys",
   "group": "Hydrographic charting"
 },
 {
   "name": "Science support on Research Vessel (RV) Investigator",
   "group": "Data collection and acquisition"
 },
 {
   "name": "Seabed mapping to hydrographic standards to support the development of datasets with multiple use applications",
   "group": "Other (please specify)"
 },
 {
   "name": "Seafloor geological mapping",
   "group": "Seafloor type mapping"
 },
 {
   "name": "Seafloor type mapping",
   "group": "Seafloor type mapping"
 },
 {
   "name": "Sediment compartment mapping for coastal management",
   "group": "Seafloor type mapping"
 },
 {
   "name": "Shallow water science",
   "group": "Marine habitat mapping"
 },
 {
   "name": "Shallow water survey for Navigation",
   "group": "Law Enforcement and Defence (Inc. search and rescue)"
 },
 {
   "name": "Site survey for Oil and Gas",
   "group": "Mineral resource (Inc. oil and gas)"
 },
 {
   "name": "Substrate mapping",
   "group": "Coastal zone management"
 },
 {
   "name": "Substrate mapping (soft versus reef habitats) for Australian Marine Parks",
   "group": "Marine and coastal conservation"
 },
 {
   "name": "to determine location of hydrocarbon seeps and collect geochemical samples of the seafloor at seeps",
   "group": "Other (please specify)"
 },
 {
   "name": "Under Keel Clearance Survey",
   "group": "Hydrographic charting"
 },
 {
   "name": "Sediment mapping and grain size interpretation",
   "group": "Seafloor type mapping"
 }
];
