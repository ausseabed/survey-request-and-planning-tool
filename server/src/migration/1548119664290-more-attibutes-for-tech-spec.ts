import {MigrationInterface, QueryRunner} from "typeorm";

export class moreAttibutesForTechSpec1548119664290 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "surveyClassification" character varying`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "featuresOfInterest" character varying`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "vesselType" character varying`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "depthRange" character varying`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "frequencyRange" character varying`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "timeSensitive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "timeSensitiveRequirements" character varying`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "groundTruthing" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "groundTruthingMethod" character varying`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "groundTruthingRequirements" character varying`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "mappingCoverageRequirements" character varying`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "surveyLines" geometry(MultiLineString,4326)`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "environmentalConditions" character varying`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "positioningRequirement" character varying`);
        await queryRunner.query(`ALTER TABLE "tech_spec" ADD "positioningRequirementOther" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "positioningRequirementOther"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "positioningRequirement"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "environmentalConditions"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "surveyLines"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "mappingCoverageRequirements"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "groundTruthingRequirements"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "groundTruthingMethod"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "groundTruthing"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "timeSensitiveRequirements"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "timeSensitive"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "frequencyRange"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "depthRange"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "vesselType"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "featuresOfInterest"`);
        await queryRunner.query(`ALTER TABLE "tech_spec" DROP COLUMN "surveyClassification"`);
    }

}
