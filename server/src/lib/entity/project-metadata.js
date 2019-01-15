import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne,
  JoinTable} from "typeorm";

import { DataCaptureType } from './data-capture-type';
import { DateTransformer } from './utils';
import { InstrumentType } from './instrument-type';
import { Organisation } from './organisation';
import { SurveyApplication } from './survey-application';

// valid values for the `projectStatus` attribute
export const PROJECT_STATUSES = [
  "planning",
  "scheduled",
  "in progress",
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

}
