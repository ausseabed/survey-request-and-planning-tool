import {MigrationInterface, QueryRunner} from "typeorm";

import { DataCaptureType } from '../lib/entity/data-capture-type';
import { insertDataAndInstrumentTypes }
  from '../migration-utils';
import { InstrumentType } from '../lib/entity/instrument-type';

const dataAndInstrumentTypes = require('./data-and-instrument-types.json');

export class updateInstrumentAndDataTypes1553573837744 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

      // delete all references to existing data capture types
      // in project metadatas
      // note: bug in model defn means we have to delete from two join tables
      await queryRunner.manager.createQueryBuilder()
      .delete()
      .from("project_metadata_data_capture_types_data_capture_type")
      .execute();

      await queryRunner.manager.createQueryBuilder()
      .delete()
      .from("data_capture_type_project_metadatas_project_metadata")
      .execute();

      // delete all references to existing instrument types
      // in project metadatas
      // note: bug in model defn means we have to delete from two join tables
      await queryRunner.manager.createQueryBuilder()
      .delete()
      .from("project_metadata_instrument_types_instrument_type")
      .execute();

      await queryRunner.manager.createQueryBuilder()
      .delete()
      .from("instrument_type_project_metadatas_project_metadata")
      .execute();

      await queryRunner.manager.createQueryBuilder()
      .delete()
      .from("instrument_type_project_metadatas_project_metadata")
      .execute();

      // now delete list of instrument types and data to capture types
      await queryRunner.manager.createQueryBuilder()
      .delete()
      .from(InstrumentType)
      .execute();

      await queryRunner.manager.createQueryBuilder()
      .delete()
      .from(DataCaptureType)
      .execute();

      await insertDataAndInstrumentTypes(queryRunner, dataAndInstrumentTypes);

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
