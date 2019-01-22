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
  "Differential GPS",
  "Other",
  "Not sure",
];

@Entity()
export class TechSpec {

  // intention is this will be the same as the project metadata id
  // if the tech spec is assigned to a project. In another situation this tech
  // spec may be a default for survey application type.
  @PrimaryColumn('uuid')
  id;

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
      type:"varchar",
      nullable: true,
  })
  positioningRequirement = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  positioningRequirementOther = undefined;
}
