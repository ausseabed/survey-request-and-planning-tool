import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne,
  JoinTable, OneToMany, OneToOne, JoinColumn } from "typeorm";

import { DateTransformer } from './utils';

import { HippRequestAttachment } from './hipp-request-attachment';
import { Organisation } from './organisation';
import { ProjectMetadata } from './project-metadata';
import { RecordState } from './record-state';
import { RequestPurpose } from './request-purpose';

export const SURVEY_QUALITY_REQUIREMENTS = [
  {
    id:"HIPP - Precise",
    value:"HIPP - Precise",
    name:"HIPP - Precise",
    description:"This survey standard is the most stringent and should only be selected for small areas that require engineering level accuracies.  This may be for safety of navigation within or near a port or scientific research within the coastal zone where high precision measurements are required.  Obtaining the vertical accuracy required to support this standard is difficult and expensive and thus this standard should only be selected if a genuine need exists.",
  },
  {
    id:"IHO - Special",
    value:"IHO - Special",
    name:"IHO - Special",
    description:"This survey quality is designed for shallow water surveys (<40m) where under-keel clearance is important and should be restricted to only small areas where this level of accuracy is required.  An example of a survey where this type of accuracy is required may be the Torres Strait UKC Area or approaches to a port where under-keel clearance is important for the economic benefit of the port or the risk of grounding has a high economic or environmental cost.  This standard may be applicable for scientific research that requires high levels of horizontal and vertical accuracy plus the ability to detect small features.",
  },
  {
    id:"IHO - 1a",
    value:"IHO - 1a",
    name:"IHO - 1a",
    description:"This survey standard covers general safety of navigation surveys.  This order has the requirement to conduct a systematic survey that ensures that all features are detected, thus requires the Full Bathymetric Coverage. This survey standard would also be applicable to most scientific purposes.",
  },
  {
    id:"IHO - 1b",
    value:"IHO - 1b",
    name:"IHO - 1b",
    description:"This survey is the same as IHO 1a in the accuracies required however does not require full bathymetric coverage and therefore not all features will be detected.",
  },
  {
    id:"HIPP - 2",
    value:"HIPP - 2",
    name:"HIPP - 2",
    description:"This standard is intended to cover surveys that require a greater knowledge of the seafloor on the continental shelf margins and is designed to support research within the 100-300m depth band.  This standard has increased accuracy requirements within this depth band and the need to obtain full bathymetric coverage.",
  },
  {
    id:"IHO - 2",
    value:"IHO - 2",
    name:"IHO - 2",
    description:"This is a low accuracy survey standard for deep water surveys and only provides a general description of the seabed and does not require full bathymetric coverage.   If full bathymetric coverage is required, this will need to be detailed in the Comments section.",
  },
];

export const CHART_PRODUCT_QUALITY_IMPACT_REQUIREMENTS = [
  {
    id:"A1",
    value:"A1",
    name:"A1"
  },
  {
    id:"A2",
    value:"A2",
    name:"A2"
  },
  {
    id:"B",
    value:"B",
    name:"B"
  },
  {
    id:"C",
    value:"C",
    name:"C"
  },
  {
    id:"D",
    value:"D",
    name:"D"
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

  @Column({
      type:"varchar",
      nullable: true,
  })
  name;

  @ManyToMany(
    type => Organisation,
    organisation => organisation.requestingAgenciesHipp)
  @JoinTable()
  requestingAgencies;

  @Column({
      type:"varchar",
      nullable: true,
  })
  requestorName;

  @Column({
      type:"varchar",
      nullable: true,
  })
  requestorPosition;

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
      transformer: new DateTransformer(),
      nullable: true,
  })
  requestDateStart;

  @Column({
      type:"timestamp with time zone",
      transformer: new DateTransformer(),
      nullable: true,
  })
  requestDateEnd;

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

  @Column({
      type:"varchar",
      nullable: true,
  })
  moratoriumComment;

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
    nullable: true,
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
    nullable: true,
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

  @ManyToMany(
    type => RequestPurpose,
    requestPurpose => requestPurpose.requests)
  @JoinTable()
  purposes;

  @OneToMany(
    type => HippRequestAttachment,
    attachment => attachment.entity)
  attachments;

  @OneToMany(
    type => ProjectMetadata,
    projectMetadata => projectMetadata.hippRequest)
  projects;

  @OneToOne(type => RecordState, { cascade: true })
  @JoinColumn()
  recordState;

  @Column({
      type:"bool",
      nullable: false,
      default: false,
  })
  deleted = false;
}
