import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany,
  JoinTable} from "typeorm";

import { ProjectMetadata } from './project-metadata';
import { SurveyTechnicalSpecifications }
  from './survey-technical-specifications';

@Entity()
export class SurveyApplication {

  @PrimaryGeneratedColumn('uuid')
  id = undefined;

  @Column("varchar")
  name = undefined;

  @Column("varchar")
  group = undefined;

  @ManyToMany(
    type => ProjectMetadata,
    projectMetadata => projectMetadata.applications)
  @JoinTable()
  projectMetadatas;

}
