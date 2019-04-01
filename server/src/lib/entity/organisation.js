import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany,
  JoinTable} from "typeorm";

import { ProjectMetadata } from './project-metadata';
import { TechSpec }
  from './tech-spec';

@Entity()
export class Organisation {

  @PrimaryGeneratedColumn('uuid')
  id = undefined;

  @Column("varchar")
  name = undefined;

  @ManyToMany(
    type => ProjectMetadata,
    projectMetadata => projectMetadata.organisations)
  projectMetadatas;

  @OneToMany(
    type => ProjectMetadata,
    projectMetadata => projectMetadata.tenderer)
  tenderProjectMetadatas;

  @ManyToMany(
    type => ProjectMetadata,
    projectMetadata => projectMetadata.surveyors)
  surveyorProjectMetadatas;
}
