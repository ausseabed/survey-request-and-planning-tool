import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne,
  JoinTable, OneToMany} from "typeorm";

import { DateTransformer } from './utils';

import { HippRequestAttachment } from './hipp-request-attachment';
import { Organisation } from './organisation';
import { ProjectMetadata } from './project-metadata';


export const SURVEY_QUALITY_REQUIREMENTS = [
  {
    value:"HIPP - Precise",
    label:"HIPP - Precise"
  },
  {
    value:"IHO - Special",
    label:"IHO - Special"
  },
  {
    value:"IHO - 1a",
    label:"IHO - 1a"
  },
  {
    value:"IHO - 1b",
    label:"IHO - 1b"
  },
  {
    value:"HIPP - 2",
    label:"HIPP - 2"
  },
  {
    value:"IHO - 2",
    label:"IHO - 2"
  },
  {
    value:"HIPP - Passage",
    label:"IHO - Passage"
  }
];

export const CHART_PRODUCT_QUALITY_IMPACT_REQUIREMENTS = [
  {
    value:"A1",
    label:"A1"
  },
  {
    value:"A2",
    label:"A2"
  },
  {
    value:"B",
    label:"B"
  },
  {
    value:"C",
    label:"C"
  },
  {
    value:"D",
    label:"D"
  }
];

export const RISK_MATRIX = {
  "Very High - High": {
    "Immediate / urgent (1-2 years)": 1,
    "Short to mid-term (2-5 years)": 1,
    "Mid to long-term (5-10 years)": 2,
  },
  "High - Moderate": {
    "Immediate / urgent (1-2 years)": 1,
    "Short to mid-term (2-5 years)": 2,
    "Mid to long-term (5-10 years)": 3,
  },
  "Moderate - Low": {
    "Immediate / urgent (1-2 years)": 2,
    "Short to mid-term (2-5 years)": 3,
    "Mid to long-term (5-10 years)": 3,
  }
}


@Entity()
export class HippRequest {

  @PrimaryGeneratedColumn('uuid')
  id;

  @Column("varchar")
  name;

  @ManyToOne(
    type => Organisation,
    organisation => organisation.requestingAgencyHipp,
    { nullable: true })
  requestingAgency;

  @Column({
      type:"varchar",
      nullable: true,
  })
  requestorName;

  @Column({
      type:"varchar",
      nullable: true,
  })
  pointOfContactEmail;

  @Column({
      type:"varchar",
      nullable: true,
  })
  pointOfContactPhone;

  //stored as date type in the database, but transformer handles marshalling
  // to/from the database and the UTC millisecond ints used by the web services
  @Column({
      type:"timestamp with time zone",
      transformer: new DateTransformer()
  })
  requestDate;

  @Column({
      type:"varchar",
      nullable: true,
  })
  areaName;

  @Column({
      type:"varchar",
      nullable: true,
  })
  area;

  @Column({
      type:"varchar",
      nullable: true,
  })
  businessJustification;

  @Column({
      type:"varchar",
      nullable: true,
  })
  costBenefit;

  @Column({
      type:"bool",
      nullable: false,
      default: false,
  })
  hasMoratorium;

  @Column({
      type:"timestamp with time zone",
      transformer: new DateTransformer(),
      nullable: true,
  })
  moratoriumDate;

  @Column("geometry", {
    spatialFeatureType: "MultiPolygon",
    srid: 4326,
    nullable: true,
  })
  areaOfInterest;

  @Column({
      type:"varchar",
      nullable: true,
  })
  comments;

  @Column({
    type:"simple-array",
    default: ""
  })
  surveyQualityRequirements = [];

  @Column({
      type:"varchar",
      nullable: true,
  })
  surveyQualityRequirementsComments;

  @Column({
    type:"simple-array",
    default: ""
  })
  chartProductQualityImpactRequirements = [];

  @Column({
      type:"varchar",
      nullable: true,
  })
  chartProductQualityImpactRequirementsComments;

  @Column({
    type: "json",
    nullable: true
  })
  riskData = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  riskIssues;

  @OneToMany(
    type => HippRequestAttachment,
    attachment => attachment.entity)
  attachments;

  @OneToMany(
    type => ProjectMetadata,
    projectMetadata => projectMetadata.hippRequest)
  projects;

  @Column({
      type:"bool",
      nullable: false,
      default: false,
  })
  deleted = false;
}
