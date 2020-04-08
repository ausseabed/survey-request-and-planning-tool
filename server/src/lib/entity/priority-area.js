import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";

import { PriorityAreaSubmission } from './priority-area-submission';


export const PREFERRED_TIMEFRAME_OPTIONS = [
  "Short",
  "Medium",
  "Long",
];

export const RISK_RATING_OPTIONS = [
  "Low",
  "Medium",
  "High",
];

export const REQUIRED_DATA_QUALITY_OPTIONS = [
  "Low",
  "Medium",
  "High",
];

export const DATA_IMPORTANCE_OPTIONS = [
  "Low",
  "Medium",
  "High",
];


@Entity()
export class PriorityArea {

  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({
      type:"varchar",
      nullable: true,
  })
  name;

  @Column({
      type:"varchar",
      nullable: true,
  })
  preferredTimeframe;

  @Column({
      type:"varchar",
      nullable: true,
  })
  riskRating;

  @Column({
      type:"varchar",
      nullable: true,
  })
  requiredDataQuality;

  @Column({
      type:"varchar",
      nullable: true,
  })
  dataImportance;

  @Column("geometry", {
    name: "area_of_interest",
    spatialFeatureType: "MultiPolygon",
    srid: 4326,
    nullable: true,
  })
  areaOfInterest;

  @ManyToOne(
    type => PriorityAreaSubmission,
    submission => submission.priorityAreas
  )
  priorityAreaSubmissionSubmission;
}
