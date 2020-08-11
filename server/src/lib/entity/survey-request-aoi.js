import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn
  } from "typeorm";
import { getConnection } from 'typeorm';

import { SurveyRequest } from './survey-request';

export const SURVEY_REQUEST_AOI_SURVEY_STANDARD = [
  'HIPP - Precise',
  'IHO - Special',
  'IHO - 1a',
  'IHO - 1b',
  'HIPP - 2',
  'IHO - 2',
  'HIPP - Passage',
];

export const SURVEY_REQUEST_AOI_OVERALL_RISK = [
  'High',
  'Moderate',
  'Low',
];

export const SURVEY_REQUEST_AOI_PREFERRED_TIMEFRAME = [
  'Urgent (1-2 years)',
  'Mid-term (2-5 years)',
  'Long-term (5-10 years)',
];

export const SURVEY_REQUEST_AOI_DATA_TYPES = [
  'Bathymetry',
  'Imagery',
  'Seabed Backscatter',
  'Seabed Sample',
  'Sound Velocity Profile (SVP)',
  'Sub-bottom Profile',
  'Water Column Backscatter (multibeam only)',
];


@Entity()
export class SurveyRequestAoi {

  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({
      type:"varchar",
      nullable: true,
  })
  name;

  @Column({
      name: "survey_standard",
      type:"varchar",
      nullable: true,
  })
  surveyStandard;

  @Column({
      name: "overall_risk",
      type:"varchar",
      nullable: true,
  })
  overallRisk;

  @Column({
      name: "preferred_timeframe",
      type:"varchar",
      nullable: true,
  })
  preferredTimeframe;

  @Column({
    name: "data_types_to_capture",
    type:"simple-array",
    nullable: true,
    default: ""
  })
  dataTypesToCapture = [];

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
  @JoinColumn({ name: "survey_request_id" })
  surveyRequest;

  @Column({
      name: "calculated_area",
      type:"decimal",
      nullable: true,
  })
  calculatedArea;

}
