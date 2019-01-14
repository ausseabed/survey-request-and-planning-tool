import {Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne,
  JoinColumn, JoinTable}
  from "typeorm";

import { DataCaptureType } from './data-capture-type';
import { DateTransformer } from './utils';
import { InstrumentType } from './instrument-type';
import { ProjectMetadata } from './project-metadata';
import { Organisation } from './organisation';


// valid values for the `projectStatus` attribute
export const PROJECT_STATUSES = [
  "planning",
  "scheduled",
  "in progress",
];

@Entity()
export class SurveyTechnicalSpecifications {

  @OneToOne(type => ProjectMetadata, { primary: true })
  @JoinColumn({ name: "projectMetadataId" })
  projectMetadataId;

  @ManyToOne(
    type => Organisation,
    organisation => organisation.tenderSurveyTechnicalSpecifications)
  tenderer;

  @ManyToMany(
    type => Organisation,
    organisation => organisation.surveyorSurveyTechnicalSpecifications)
  @JoinTable()
  surveyors;

  @Column({
      type:"varchar",
      nullable: true,
  })
  contractNumber = undefined;

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



}
