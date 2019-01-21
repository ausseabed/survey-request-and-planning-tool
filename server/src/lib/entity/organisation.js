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
  @JoinTable()
  projectMetadatas;

  @OneToMany(
    type => TechSpec,
    techSpecs => techSpecs.tenderer)
  tenderTechSpecs;

  @ManyToMany(
    type => TechSpec,
    techSpecs => techSpecs.surveyors)
  @JoinTable()
  surveyorTechSpecs;
}
