import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany,
  JoinTable} from "typeorm";

import { ProjectMetadata } from './project-metadata';

@Entity()
export class SurveyApplication {

  @PrimaryGeneratedColumn('uuid')
  id = undefined;

  @Column("varchar")
  name = undefined;

  @Column("varchar")
  group = undefined;

  @Column({
    type: "bool",
    default: false
  })
  userSubmitted = false;

  @Column("bool")
  deleted = false;

  @Column({
    type: "json",
    nullable: true
  })
  defaults = undefined;

  @OneToMany(
    type => ProjectMetadata,
    projectMetadata => projectMetadata.surveyApplication)
  projectMetadatas;

}
