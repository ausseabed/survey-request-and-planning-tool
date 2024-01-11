import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,
  Generated } from "typeorm";
import { getConnection } from 'typeorm';

import { SurveyRequest } from './survey-request';

export const SURVEY_REQUEST_AOI_SURVEY_STANDARD = [
  {'name': 'HIPP Precise', 'description': 'This survey standard is the most stringent and should only be selected for small areas that require engineering level accuracies.  This may be for safety of navigation within or near a port or scientific research within the coastal zone where high precision measurements are required.  Obtaining the vertical accuracy required to support this standard is difficult and expensive and thus this standard should only be selected if a genuine need exists.'},
  {'name': 'IHO Special Order', 'description': 'This survey quality is designed for shallow water surveys (<40m) where under-keel clearance is important and should be restricted to only small areas where this level of accuracy is required.  An example of a survey where this type of accuracy is required may be the Torres Strait UKC Area or approaches to a port where under-keel clearance is important for the economic benefit of the port or the risk of grounding has a high economic or environmental cost.  This standard may be applicable for scientific research that requires high levels of horizontal and vertical accuracy plus the ability to detect small features.'},
  {'name': 'IHO Order 1a', 'description': 'This survey standard covers general safety of navigation surveys.  This order has the requirement to conduct a systematic survey that ensures that all features are detected, thus requires the Full Bathymetric Coverage (overlapping MBES swaths – see diagram). This survey standard would also be applicable to most scientific purposes.'},
  {'name': 'IHO Order 1b', 'description': 'This survey is the same as IHO 1a in the accuracies required however does not require full bathymetric coverage and therefore not all features will be detected.'},
  {'name': 'IHO Order 2', 'description': 'This is a low accuracy survey standard for deep water surveys and only provides a general description of the seabed and does not require full bathymetric coverage.   If full bathymetric coverage is required, this will need to be detailed in the Comments section.'},
  {'name': 'HIPP Passage', 'description': ''}
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

  @Column({type:"int"})
  @Generated('increment')
  counter;

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
