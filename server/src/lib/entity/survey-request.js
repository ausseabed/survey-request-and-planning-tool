import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne,
  JoinTable, OneToMany, OneToOne, JoinColumn } from "typeorm";

import { DateTransformer } from './utils';

import { Attachment } from './attachment';
import { Custodian } from './custodian';
import { SurveyRequestAttachment } from './survey-request-attachment';
import { SurveyRequestAoi } from './survey-request-aoi';
import { Organisation } from './organisation';
import { RecordState } from './record-state';
import { Task } from './task';


@Entity()
export class SurveyRequest {

  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({
      type:"varchar",
      nullable: true,
  })
  name;

  @ManyToMany(
    type => Custodian,
    custodian => custodian.custodiansHipp)
  @JoinTable()
  custodians;

  @ManyToOne(
    type => Organisation,
    {
      nullable: true
    }
  )
  @JoinColumn({ name: "organisation_id" })
  organisation;

  @ManyToMany(
    type => Organisation,
    organisation => organisation.surveyRequests)
  @JoinTable()
  organisations;

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
      type:"varchar",
      nullable: true,
  })
  costBenefit;

  @OneToOne(
    type => Attachment,
    {
      nullable: true
    }
  )
  @JoinColumn()
  businessCaseAttachment;

  @Column({
      type:"bool",
      nullable: false,
      default: false,
  })
  additionalFundingAvailable;

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
    name: "area_of_interest",
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

  @Column({
      type:"varchar",
      nullable: true,
  })
  furtherInformation;

  @OneToMany(
    type => SurveyRequestAttachment,
    attachment => attachment.entity)
  attachments;

  @OneToOne(type => RecordState, { cascade: true })
  @JoinColumn()
  recordState;

  @Column({
      type:"bool",
      nullable: false,
      default: false,
  })
  public = false;

  @OneToMany(
    type => SurveyRequestAoi,
    surveyRequestAoi => surveyRequestAoi.surveyRequest,
    { cascade: true }
  )
  aois;

  @Column({
      type:"uuid",
      name:"upload_task_id",
      nullable: true,
  })
  uploadTaskId;

  @OneToOne(
    type => Task,
    {
      cascade: true,
      nullable: true
    }
  )
  @JoinColumn({ name: "upload_task_id" })
  uploadTask;

  @Column({
      type:"bool",
      nullable: false,
      default: false,
  })
  deleted = false;
}
