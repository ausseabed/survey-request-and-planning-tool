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

  @Column({
      type:"varchar",
      nullable: true,
  })
  abn = undefined;

  @Column({
      type:"bool",
      nullable: false,
      default: false,
  })
  deleted = false;

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
