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

  // intention is this will be the same as the project metadata id
  // if the tech spec is assigned to a project. In another situation this tech
  // spec may be a default for survey application type.
  @PrimaryColumn('uuid')
  id;

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
