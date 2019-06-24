import {MigrationInterface, QueryRunner} from "typeorm";

export class requestFieldsNullable1561419714445 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "hipp_request" ALTER COLUMN "surveyQualityRequirements" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "hipp_request" ALTER COLUMN "chartProductQualityImpactRequirements" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "hipp_request" ALTER COLUMN "chartProductQualityImpactRequirements" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "hipp_request" ALTER COLUMN "surveyQualityRequirements" SET NOT NULL`);
    }

}
