import {MigrationInterface, QueryRunner} from "typeorm";

export class addDefaultsAttrSurveyApplication1549426786152 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "survey_application" ADD "defaults" json`);
        await queryRunner.query(`ALTER TABLE "survey_application" ADD "deleted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "survey_deliverable" DROP CONSTRAINT "FK_2f2d76329b1d32653da3552dc6a"`);
        await queryRunner.query(`ALTER TABLE "survey_deliverable" DROP CONSTRAINT "FK_fc68a5c1b48e69d646436e4f365"`);
        await queryRunner.query(`ALTER TABLE "survey_deliverable" ALTER COLUMN "definitionId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "survey_deliverable" ALTER COLUMN "projectMetadataId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "survey_deliverable" ADD CONSTRAINT "FK_2f2d76329b1d32653da3552dc6a" FOREIGN KEY ("definitionId") REFERENCES "deliverable_definition"("id")`);
        await queryRunner.query(`ALTER TABLE "survey_deliverable" ADD CONSTRAINT "FK_fc68a5c1b48e69d646436e4f365" FOREIGN KEY ("projectMetadataId") REFERENCES "project_metadata"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "survey_deliverable" DROP CONSTRAINT "FK_fc68a5c1b48e69d646436e4f365"`);
        await queryRunner.query(`ALTER TABLE "survey_deliverable" DROP CONSTRAINT "FK_2f2d76329b1d32653da3552dc6a"`);
        await queryRunner.query(`ALTER TABLE "survey_deliverable" ALTER COLUMN "projectMetadataId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "survey_deliverable" ALTER COLUMN "definitionId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "survey_deliverable" ADD CONSTRAINT "FK_fc68a5c1b48e69d646436e4f365" FOREIGN KEY ("projectMetadataId") REFERENCES "project_metadata"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_deliverable" ADD CONSTRAINT "FK_2f2d76329b1d32653da3552dc6a" FOREIGN KEY ("definitionId") REFERENCES "deliverable_definition"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_application" DROP COLUMN "defaults"`);
        await queryRunner.query(`ALTER TABLE "survey_application" DROP COLUMN "deleted"`);
    }

}
