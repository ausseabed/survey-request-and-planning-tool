import {MigrationInterface, QueryRunner} from "typeorm";

export class activateGdal1557815878510 implements MigrationInterface {


    public async up(queryRunner: QueryRunner): Promise<any> {
      // The reason for catching errors generated here is that "rds_superuser"
      // role which is given to RDS admin user is not full-on postgres root
      // - there are some limitations AWS has to impose in order to operate
      // managed database instances securely and efficiently.

      // The enabled drivers within RDS alread include those listed below
      const isRdsMode = process.env.RDS_MODE || false

      if (isRdsMode) {
          console.log("Running in RDS mode - skipping system-level DB parameters migration")
      } else {
          await queryRunner.query(`CREATE EXTENSION postgis_raster`);
          await queryRunner.query(`SET postgis.gdal_enabled_drivers = 'ENABLE_ALL'`);
          await queryRunner.query(`ALTER DATABASE "postgres" SET postgis.gdal_enabled_drivers TO 'GTiff PNG JPEG'`);
      }

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
