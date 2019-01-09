import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable}
  from "typeorm";

import { Organisation } from './organisation';

@Entity()
export class ProjectMetadata {

  @PrimaryGeneratedColumn('uuid')
  id = undefined;

  @Column("varchar")
  surveyName = "";

  @Column("varchar")
  contactPerson = "";

  @Column("varchar")
  email = "";

  @ManyToMany(
    type => Organisation,
    organisation => organisation.projectMetadatas)
  @JoinTable()
  organisations;

  @Column("geometry", {
    spatialFeatureType: "MultiPolygon",
    srid: 4326
  })
  areaOfInterest;
}
