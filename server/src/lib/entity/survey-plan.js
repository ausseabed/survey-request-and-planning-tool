import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne,
  JoinTable, OneToMany, JoinColumn, OneToOne} from "typeorm";

import { Custodian } from './custodian';
import { DataCaptureType } from './data-capture-type';
import { DateTransformer } from './utils';
import { InstrumentType } from './instrument-type';
import { Organisation } from './organisation';
import { RecordState } from './record-state';
import { SurveyApplication } from './survey-application';
import { SurveyAttachment } from './survey-attachment';
import { SurveyDeliverable } from './survey-deliverable';
import { SurveyRequest } from './survey-request';
import { TechSpec } from './tech-spec';

// valid values for the `status` attribute
export const SURVEY_PLAN_STATUSES = [
  "Planning",
  "Scheduled",
  "Complete",
  "Abandoned",
];

@Entity()
export class SurveyPlan {

  @PrimaryGeneratedColumn('uuid')
  id = undefined;

  @Column("varchar")
  surveyName = "";

  @Column("varchar")
  contactPerson = "";

  @Column("varchar")
  email = "";

  @Column("varchar")
  status = SURVEY_PLAN_STATUSES[0];

  @Column({
      type:"varchar",
      nullable: true,
  })
  vessel = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  comment = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  quality = undefined;

  @ManyToMany(
    type => Organisation,
    organisation => organisation.surveyPlans)
  @JoinTable()
  organisations;

  @ManyToMany(
    type => Custodian,
    custodian => custodian.surveyPlans)
  @JoinTable()
  custodians;

  @Column("geometry", {
    spatialFeatureType: "MultiPolygon",
    srid: 4326,
    nullable: true,
  })
  areaOfInterest;

  //stored as date type in the database, but transformer handles marshalling
  // to/from the database and the UTC millisecond ints used by the web services
  @Column({
      type:"timestamp with time zone",
      transformer: new DateTransformer(),
      nullable: true,
  })
  startDate;

  @Column({
      type:"timestamp with time zone",
      transformer: new DateTransformer(),
      nullable: true,
  })
  endDate;

  @ManyToMany(
    type => DataCaptureType,
    dataCaptureType => dataCaptureType.surveyPlans)
  @JoinTable()
  dataCaptureTypes;

  @ManyToMany(
    type => InstrumentType,
    instrumentType => instrumentType.surveyPlans)
  @JoinTable()
  instrumentTypes;

  @ManyToOne(
    type => SurveyApplication,
    surveyApplication => surveyApplication.surveyPlans)
  surveyApplication;

  //survey metadata fields
  @Column({
    type:"varchar",
    nullable: true,
  })
  contractNumber = undefined;

  @Column({
    type:"varchar",
    nullable: true,
  })
  surveyId = undefined;

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

  @Column({
      type:"varchar",
      nullable: true,
  })
  tenderer;

  @Column({
      type:"varchar",
      nullable: true,
  })
  surveyors;

  @OneToMany(
    type => SurveyAttachment,
    attachment => attachment.entity)
  attachments;

  @OneToMany(
    type => SurveyDeliverable,
    sd => sd.surveyPlan)
  deliverables;

  @ManyToOne(
    type => SurveyRequest,
    surveyRequest => surveyRequest.surveyPlans,
    { nullable: true }
  )
  @JoinColumn({ name: "surveyRequestId" })
  surveyRequest;

  @OneToOne(type => TechSpec)
  @JoinColumn({ name: "id" })
  techSpec;

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
