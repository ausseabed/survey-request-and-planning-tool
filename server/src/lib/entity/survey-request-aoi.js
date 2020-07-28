import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, AfterLoad
  } from "typeorm";
import { getConnection } from 'typeorm';

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

  calculatedArea;

  @AfterLoad()
  setCalculatedArea = async() => {
    try {
      const result = await getConnection()
        .getRepository(SurveyRequestAoi)
        .createQueryBuilder('survey_request_aoi')
        .select([`ST_Area(geom::geography)`])
        .where('survey_request_aoi.id = :id', { id: this.id })
        .getRawOne();

      this.calculatedArea = result.st_area;
    } catch (error) {
      console.error(error);
    }
  };
}
