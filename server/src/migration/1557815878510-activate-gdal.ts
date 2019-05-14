import {MigrationInterface, QueryRunner} from "typeorm";

export class activateGdal1557815878510 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`SET postgis.gdal_enabled_drivers = 'ENABLE_ALL'`);
      await queryRunner.query(`ALTER DATABASE "postgres" SET postgis.gdal_enabled_drivers TO 'GTiff PNG JPEG'`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
