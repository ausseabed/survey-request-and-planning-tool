import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

import { PriorityAreaSubmission } from './priority-area-submission';


export const PREFERRED_TIMEFRAME_OPTIONS = [
  "Urgent (1-2 years)",
  "Mid-term (2-5 years)",
  "Long-term (5-10 years)",
];

export const RISK_RATING_OPTIONS = [
  "High",
  "Moderate",
  "Low",
];

export const REQUIRED_DATA_QUALITY_OPTIONS = [
  'HIPP Precise',
  'IHO Special Order',
  'IHO Order 1a',
  'IHO Order 1b',
  'IHO Order 2',
  'HIPP Passage',
  'To be defined',
];

export const PRIORITY_OPTIONS = [
  "1",
  "2",
  "3",
];


@Entity()
export class PriorityArea {

  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({
    type: "varchar",
    nullable: true,
  })
  name;

  @Column({
    type: "varchar",
    nullable: true,
  })
  preferredTimeframe;

  @Column({
    type: "varchar",
    nullable: true,
    name: "timeframe_reason"
  })
  timeframeReason;

  @Column({
    type: "varchar",
    nullable: true,
    name: "preferred_season"
  })
  preferredSeason;

  @Column({
    type: "varchar",
    nullable: true,
    name: "collection_cadence"
  })
  collectionCadence;

  @Column({
    type: "varchar",
    nullable: true,
    name: "time_series_description"
  })
  timeSeriesDescription;

  @Column({
    type: "varchar",
    nullable: true,
    name: "perceived_impact"
  })
  perceivedImpact;

  @Column({
    type: "varchar",
    nullable: true,
    name: "organisational_priority"
  })
  organisationalPriority;

  @Column({
    name: "existing_data_sources",
    type: "simple-array",
    nullable: true,
    default: ""
  })
  existingDataSources = [];

  @Column({
    type: "varchar",
    nullable: true,
    name: "reason_for_aoi_raise"
  })
  reasonForAoiRaise;

  @Column({
    type: "varchar",
    nullable: true,
    name: "existing_data_assessment_comments"
  })
  existingDataAssessmentComments;

  @Column({
    type: "varchar",
    nullable: true,
    name: "grid_size"
  })
  gridSize;

  @Column({
    type: "varchar",
    nullable: true,
    name: "survey_standard"
  })
  surveyStandard;

  @Column({
    type: "simple-array",
    nullable: true,
    name: "data_to_capture",
    default: ""
  })
  dataToCapture = [];

  @Column({
    type: "simple-array",
    nullable: true,
    name: "data_capture_methods",
    default: ""
  })
  dataCaptureMethods = [];

  @Column({
    type: "simple-array",
    nullable: true,
    name: "pressures",
    default: ""
  })
  pressures = [];

  @Column({
    type: "simple-array",
    nullable: true,
    name: "purposes",
    default: ""
  })
  purposes = [];

  @Column({
    type: "simple-array",
    nullable: true,
    name: "purpose_flags",
    default: ""
  })
  purposeFlags = [];

  @Column({
    type: "simple-array",
    nullable: true,
    name: "purpose_values",
    default: ""
  })
  purposeValues = [];

  @Column({
    type: "simple-array",
    nullable: true,
    name: "ecosystems",
    default: ""
  })
  ecosystems = [];

  @Column({
    type: "varchar",
    nullable: true,
  })
  riskRating;

  @Column({
    type: "varchar",
    nullable: true,
  })
  requiredDataQuality;

  @Column({
    type: "varchar",
    nullable: true,
  })
  priority;

  @Column({
    type: "varchar",
    nullable: true,
    name: "seacountry_name"
  })
  seacountryName;

  @Column({
    type: "varchar",
    nullable: true,
    name: "ecological_area_name"
  })
  ecologicalAreaName;

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
    type => PriorityAreaSubmission,
    submission => submission.priorityAreas
  )
  priorityAreaSubmissionSubmission;
}
