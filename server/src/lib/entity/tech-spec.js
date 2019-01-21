import {Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne,
  JoinColumn, JoinTable}
  from "typeorm";

import { DataCaptureType } from './data-capture-type';
import { DateTransformer } from './utils';
import { InstrumentType } from './instrument-type';
import { ProjectMetadata } from './project-metadata';
import { Organisation } from './organisation';


@Entity()
export class TechSpec {

  @PrimaryColumn('uuid')
  projectMetadataId;

  @ManyToOne(
    type => Organisation,
    organisation => organisation.tenderTechSpecs)
  tenderer;

  @ManyToMany(
    type => Organisation,
    organisation => organisation.surveyorTechSpecs)
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
