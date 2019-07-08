var _ = require('lodash');
import {MigrationInterface, QueryRunner} from "typeorm";

import { RequestPurpose } from '../lib/entity/request-purpose';

export class groupOrderForRequestPurpose1562629362829 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DELETE FROM "request_purpose"`);
        await queryRunner.query(`ALTER TABLE "request_purpose" ADD "groupOrder" integer NOT NULL`);


        const purposes = [
          { group: "Nautical Charting Survey", groupOrder: 1, name: "Under-keel Clearance Area" },
          { group: "Nautical Charting Survey", groupOrder: 1, name: "Approaches to a Port" },
          { group: "Nautical Charting Survey", groupOrder: 1, name: "Coastal Survey" },
          { group: "Nautical Charting Survey", groupOrder: 1, name: "Deepwater Survey" },

          { group: "Science", groupOrder: 2 ,name: "Habitat Mapping and Ecosystem Modelling" },
          { group: "Science", groupOrder: 2, name: "Coastal Zone Management and Marine Conservation" },
          { group: "Science", groupOrder: 2, name: "Hydrodynamic and Storm Surge Modelling"},

          { group: "Other Purposes", groupOrder: 3, name: "AUS Hydroid"},
          { group: "Other Purposes", groupOrder: 3, name: "Delineation of littoral features"},
          { group: "Other Purposes", groupOrder: 3, name: "Oceanographic Observations"},
          { group: "Other Purposes", groupOrder: 3, name: "Shoal Investigation"},
          { group: "Other Purposes", groupOrder: 3, name: "Wreck Investigation"},
          { group: "Other Purposes", groupOrder: 3, name: "User Defined"},
        ]

        for (const purpose of purposes) {
          let purposeEntity = new RequestPurpose();

          _.merge(purposeEntity, purpose)

          purposeEntity = await queryRunner.manager
          .getRepository(RequestPurpose)
          .save(purposeEntity);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "request_purpose" DROP COLUMN "groupOrder"`);
    }

}
