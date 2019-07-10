import {MigrationInterface, QueryRunner} from "typeorm";

import { insertDataAndInstrumentTypes } from '../migration-utils';
const dataAndInstrumentTypes = require('./data-and-instrument-types.json');

export class appliesToPlansorrequestsForDatacapturetypes1562739183953 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "data_capture_type" ADD "appliesToPlan" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "data_capture_type" ADD "appliesToRequest" boolean NOT NULL DEFAULT false`);

        await insertDataAndInstrumentTypes(queryRunner, dataAndInstrumentTypes);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "data_capture_type" DROP COLUMN "appliesToRequest"`);
        await queryRunner.query(`ALTER TABLE "data_capture_type" DROP COLUMN "appliesToPlan"`);
    }

}
