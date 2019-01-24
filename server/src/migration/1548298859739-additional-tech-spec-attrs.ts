import {MigrationInterface, QueryRunner} from "typeorm";

export class additionalTechSpecAttrs1548298859739 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "overlap" character varying NOT NULL DEFAULT 'default'`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "gridSize" character varying`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "swathWidth" character varying NOT NULL DEFAULT 'default'`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "lineSpacing" character varying`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "maxSurveySpeed" character varying`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "soundingDensity" character varying`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "resolution" character varying`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "horizontalAccuracy" character varying NOT NULL DEFAULT 'default'`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "verticalAccuracy" character varying NOT NULL DEFAULT 'default'`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "horizontalRefefenceSystem" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "verticalRefefenceSystem" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "soundingDatum" character varying NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "spheroid" character varying NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "deliveryMethod" character varying NOT NULL DEFAULT 'default'`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "deliveryRequirements" character varying NOT NULL DEFAULT 'default'`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "progressReportRequirements" character varying`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "tidalGauges" boolean`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "tidalGaugeLocations" geometry(MultiPoint,4326)`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "tidalInfrastructureRequirements" character varying`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "approvalPermitRequirements" character varying`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "objectDetectionRequirements" character varying`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "positioningRequirements" character varying`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "dataGapRequirements" character varying`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "existingRisks" character varying`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "additionalRequirements" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "additionalRequirements"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "existingRisks"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "dataGapRequirements"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "positioningRequirements"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "objectDetectionRequirements"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "approvalPermitRequirements"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "tidalInfrastructureRequirements"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "tidalGaugeLocations"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "tidalGauges"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "progressReportRequirements"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "deliveryRequirements"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "deliveryMethod"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "spheroid"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "soundingDatum"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "verticalRefefenceSystem"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "horizontalRefefenceSystem"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "verticalAccuracy"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "horizontalAccuracy"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "resolution"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "soundingDensity"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "maxSurveySpeed"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "lineSpacing"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "swathWidth"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "gridSize"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "overlap"`);
    }

}
