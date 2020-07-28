import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";

import { SurveyRequest } from './survey-request';


@Entity()
export class SurveyRequestAoi {

  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({
      type:"varchar",
      nullable: true,
  })
  name;

  @Column("geometry", {
    name: "geom",
    spatialFeatureType: "MultiPolygon",
    srid: 4326,
    nullable: true,
    select: false
  })
  geom;

  @Column("bytea", {
    nullable: true,
    select: false
  })
  thumbnail;

  @ManyToOne(
    type => SurveyRequest,
    surveyRequest => surveyRequest.aois
  )
  surveyRequest;
}
