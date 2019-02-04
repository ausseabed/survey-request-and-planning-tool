import {MigrationInterface, QueryRunner} from "typeorm";

export class surveyDeliverable1549316067634 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "survey_deliverable" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "data" json, "definitionId" uuid, "projectMetadataId" uuid, CONSTRAINT "PK_87aa6e75ff8e8af230caaf8114d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "survey_deliverable" ADD CONSTRAINT "FK_2f2d76329b1d32653da3552dc6a" FOREIGN KEY ("definitionId") REFERENCES "deliverable_definition"("id")`);
        await queryRunner.query(`ALTER TABLE "survey_deliverable" ADD CONSTRAINT "FK_fc68a5c1b48e69d646436e4f365" FOREIGN KEY ("projectMetadataId") REFERENCES "project_metadata"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "survey_deliverable" DROP CONSTRAINT "FK_fc68a5c1b48e69d646436e4f365"`);
        await queryRunner.query(`ALTER TABLE "survey_deliverable" DROP CONSTRAINT "FK_2f2d76329b1d32653da3552dc6a"`);
        await queryRunner.query(`DROP TABLE "survey_deliverable"`);
    }

}
