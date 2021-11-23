import {
  Entity, PrimaryGeneratedColumn, Column
} from "typeorm";


// Schema for this table is taken straight from the marine parks shapefile
// no effort has been made to interpret what the actual column names refer
// to.

@Entity()
export class MarinePark {

  @PrimaryGeneratedColumn('uuid')
  id = undefined;

  @Column({
    type: "varchar",
    nullable: true,
  })
  netname = "";

  @Column({
    type: "varchar",
    nullable: true,
  })
  resname = "";

  @Column({
    type: "varchar",
    nullable: true,
  })
  zonename = "";

  @Column({
    type: "varchar",
    nullable: true,
  })
  zoneuicn = "";

  @Column({
    type: "varchar",
    nullable: true,
  })
  polygonid = "";

  @Column({
    type: "varchar",
    nullable: true,
  })
  natlegend = "";

  @Column("geometry", {
    name: "geometry",
    spatialFeatureType: "MultiPolygon",
    srid: 4326,
    nullable: true,
    select: false
  })
  geometry;

}
