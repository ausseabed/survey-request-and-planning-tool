import {MigrationInterface, QueryRunner} from "typeorm";

import { Role } from '../lib/entity/role'

export class canEditRolePermission1562902714848 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "role" ADD "canEditRole" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "canEditRole"`);
    }

}
