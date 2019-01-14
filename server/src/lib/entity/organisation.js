import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany,
  JoinTable} from "typeorm";

import { ProjectMetadata } from './project-metadata';
import { SurveyTechnicalSpecifications }
  from './survey-technical-specifications';

@Entity()
export class Organisation {

  @PrimaryGeneratedColumn('uuid')
  id = undefined;

  @Column("varchar")
  name = undefined;

  @ManyToMany(
    type => ProjectMetadata,
    projectMetadata => projectMetadata.organisations)
  @JoinTable()
  projectMetadatas;

  @OneToMany(
    type => SurveyTechnicalSpecifications,
    techSpecs => techSpecs.tenderer)
  tenderSurveyTechnicalSpecifications;

  @ManyToMany(
    type => SurveyTechnicalSpecifications,
    techSpecs => techSpecs.surveyors)
  @JoinTable()
  surveyorSurveyTechnicalSpecifications;
}
