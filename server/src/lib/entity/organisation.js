import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany,
  JoinTable} from "typeorm";

import { SurveyRequest } from './survey-request';
import { ProjectMetadata } from './project-metadata';
import { TechSpec } from './tech-spec';


@Entity()
export class Organisation {

  @PrimaryGeneratedColumn('uuid')
  id = undefined;

  @Column("varchar")
  name = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  description = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  abn = undefined;

  // url (or some other indication) of where this entry was obtained
  @Column({
      type:"varchar",
      nullable: true,
  })
  source = undefined;

  // unqiue identifier as used by source
  @Column({
      type:"varchar",
      nullable: true,
  })
  sourceId = undefined;

  @ManyToMany(
    type => ProjectMetadata,
    projectMetadata => projectMetadata.organisations)
  projectMetadatas;

  @ManyToMany(
    type => SurveyRequest,
    surveyRequest => surveyRequest.organisations)
  surveyRequests;

}
