import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne,
  JoinTable, OneToMany} from "typeorm";

import { DataCaptureType } from './data-capture-type';
import { DateTransformer } from './utils';
import { InstrumentType } from './instrument-type';
import { Organisation } from './organisation';
import { SurveyApplication } from './survey-application';
import { SurveyDeliverable } from './survey-deliverable';
import { SurveyFile } from './survey-file';

// valid values for the `projectStatus` attribute
export const PROJECT_STATUSES = [
  "Planning",
  "Scheduled",
  "Complete",
  "Abandoned",
];

@Entity()
export class ProjectMetadata {

  @PrimaryGeneratedColumn('uuid')
  id = undefined;

  @Column("varchar")
  surveyName = "";

  @Column("varchar")
  contactPerson = "";

  @Column("varchar")
  email = "";

  @Column("varchar")
  projectStatus = PROJECT_STATUSES[0];

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
    organisation => organisation.projectMetadatas)
  @JoinTable()
  organisations;

  @Column("geometry", {
    spatialFeatureType: "MultiPolygon",
    srid: 4326
  })
  areaOfInterest;

  //stored as date type in the database, but transformer handles marshalling
  // to/from the database and the UTC millisecond ints used by the web services
  @Column({
      type:"timestamp with time zone",
      transformer: new DateTransformer()
  })
  startDate;

  @ManyToMany(
    type => DataCaptureType,
    dataCaptureType => dataCaptureType.projectMetadatas)
  @JoinTable()
  dataCaptureTypes;

  @ManyToMany(
    type => InstrumentType,
    instrumentType => instrumentType.projectMetadatas)
  @JoinTable()
  instrumentTypes;

  @ManyToOne(
    type => SurveyApplication,
    surveyApplication => surveyApplication.projectMetadatas)
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

  @ManyToOne(
    type => Organisation,
    organisation => organisation.tenderProjectMetadatas,
    { nullable: true })
  tenderer;

  @ManyToMany(
    type => Organisation,
    organisation => organisation.surveyorProjectMetadatas)
  @JoinTable()
  surveyors;

  @OneToMany(
    type => SurveyFile,
    surveyFile => surveyFile.projectMetadata)
  files;

  @OneToMany(
    type => SurveyDeliverable,
    sd => sd.projectMetadata)
  deliverables;

  @Column({
      type:"bool",
      nullable: false,
      default: false,
  })
  deleted = false;
}
