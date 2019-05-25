import {MigrationInterface, QueryRunner} from "typeorm";

export class newDefaults1549429487016 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        // seed database with default data capture types
        const stdDataCaptureTypes= ['Multibeam data'];
        for (const dctName of stdDataCaptureTypes) {
          await queryRunner
           .manager
           .createQueryBuilder()
           .insert()
           .into("data_capture_type")
           .values({
             name:dctName,
             userSubmitted: false
           })
           .execute();
        };
    }

    public async down(queryRunner: QueryRunner): Promise<any> {

    }

}
