import {MigrationInterface, QueryRunner} from "typeorm";

export class activateGdal1557815878510 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      // The reason for catching errors generated here is that "rds_superuser"
      // role which is given to RDS admin user is not full-on postgres root
      // - there are some limitations AWS has to impose in order to operate
      // managed database instances securely and efficiently.

      // The enabled drivers within RDS alread include those listed below

      try {
        await queryRunner.query(`SET postgis.gdal_enabled_drivers = 'ENABLE_ALL'`);
        await queryRunner.query(`ALTER DATABASE "postgres" SET postgis.gdal_enabled_drivers TO 'GTiff PNG JPEG'`);
      } catch (error) {
        console.log("Migration failed");
        console.log("Note: this migration is expected to fail when run with an RDS database");
        console.log(error);
      }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
