import {Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne,
  JoinColumn, JoinTable}
  from "typeorm";

import { DataCaptureType } from './data-capture-type';
import { DateTransformer } from './utils';
import { InstrumentType } from './instrument-type';
import { ProjectMetadata } from './project-metadata';
import { Organisation } from './organisation';


// valid values for the `surveyType` attribute
export const SURVEY_TYPES = [
  "Baseline",
  "Monitoring",
];

export const SURVEY_CLASSIFICATIONS = [
  "Special order",
  "Order 1a",
  "Order 1b",
  "Order 2",
];

export const GROUND_TRUTHING_METHODS = [
  "Video",
  "Grab seabed sample",
  "Other",
];

export const POSITIONING_REQUIREMENTS = [
  "PPP",
  "RTK-GPS",
  "Differential GPS",
  "Wide Area Differential GPS",
  "GNSS",
  "Other",
  "Not sure",
];

export const DELIVERY_METHODS = [
  "Hard disk",
  "Cloud storage",
];

@Entity()
export class TechSpec {

  // intention is this will be the same as the project metadata id
  // if the tech spec is assigned to a project. In another situation this tech
  // spec may be a default for survey application type.
  @PrimaryColumn('uuid')
  id;

  // Survey Requirements

  // baseline or monitoring
  @Column({type:"varchar"})
  surveyType = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  surveyFrequency = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  requirements = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  surveyClassification = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  featuresOfInterest = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  vesselType = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  depthRange = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  frequencyRange = undefined;

  @Column("bool")
  timeSensitive = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  timeSensitiveRequirements = undefined;

  @Column("bool")
  groundTruthing = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  groundTruthingMethod = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  groundTruthingMethodOther = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  groundTruthingRequirements = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  mappingCoverageRequirements = undefined;

  @Column("geometry", {
    nullable: true,
    spatialFeatureType: "MultiLineString",
    srid: 4326
  })
  surveyLines = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  environmentalConditions = undefined;

  @Column({
    type:"simple-array",
    default: ""
  })
  positioningRequirement = [];

  @Column({
      type:"varchar",
      nullable: true,
  })
  positioningRequirementOther = undefined;

  //
  // Survey technical requirements attributes
  //

  @Column({
      type:"varchar",
      nullable: false,
  })
  overlap = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  gridSize = undefined;

  @Column({
      type:"varchar",
      nullable: false,
  })
  swathWidth = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  lineSpacing = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  maxSurveySpeed = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  soundingDensity = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  resolution = undefined;

  @Column({
      type:"varchar",
      nullable: false,
  })
  horizontalAccuracy = undefined;

  @Column({
      type:"varchar",
      nullable: false,
  })
  verticalAccuracy = undefined;

  @Column({
      type:"int",
      nullable: false,
  })
  horizontalReferenceSystem = undefined;

  @Column({
      type:"int",
      nullable: false,
  })
  verticalReferenceSystem = undefined;

  @Column({
      type:"int",
      nullable: false,
  })
  soundingDatum = undefined;

  @Column({
      type:"int",
      nullable: false,
  })
  spheroid = undefined;

  //
  // delivery requirements
  //

  @Column("simple-array")
  deliveryMethods = [];

  @Column({
      type:"varchar",
      nullable: false,
  })
  deliveryRequirements = undefined;

  //
  // Reporting requirements
  //

  @Column({
      type:"varchar",
      nullable: true,
  })
  progressReportRequirements = undefined;

  //
  // other requirements
  //

  @Column({
      type:"bool",
      nullable: true,
  })
  tidalGauges = undefined;

  @Column("geometry", {
    nullable: true,
    spatialFeatureType: "MultiPoint",
    srid: 4326
  })
  tidalGaugeLocations = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  tidalInfrastructureRequirements = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  approvalPermitRequirements = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  objectDetectionRequirements = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  positioningRequirements = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  dataGapRequirements = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  existingRisks = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  additionalRequirements = undefined;



  @Column({
      type:"bool",
      nullable: false,
      default: false,
  })
  deleted = false;
}
