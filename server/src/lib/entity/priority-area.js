import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";

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
  "HIPP - Precise",
  "IHO - Special",
  "IHO - 1a",
  "IHO - 1b",
  "HIPP - 2",
  "IHO - 2",
  "HIPP - Passage",
];

export const DATA_IMPORTANCE_OPTIONS = [
  "1",
  "2",
  "3",
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
