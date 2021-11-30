import { MigrationInterface, QueryRunner } from "typeorm";

export class priorityareaPurposes1638233261724 implements MigrationInterface {
    name = 'priorityareaPurposes1638233261724'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "area_of_interest_purpose" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "flag" character varying NOT NULL, "contextual_use" character varying NOT NULL, "value" character varying NOT NULL, "priorityAreaId" uuid, CONSTRAINT "PK_62e1cbc46d8720028d1a3306b38" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "area_of_interest_purpose" ADD CONSTRAINT "FK_ff1d02fbb4f452ea387b15a26c7" FOREIGN KEY ("priorityAreaId") REFERENCES "priority_area"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "area_of_interest_purpose" DROP CONSTRAINT "FK_ff1d02fbb4f452ea387b15a26c7"`);
        await queryRunner.query(`DROP TABLE "area_of_interest_purpose"`);
    }

}
