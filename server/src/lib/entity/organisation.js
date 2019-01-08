import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable}
  from "typeorm";

import { ProjectMetadata } from './project-metadata';

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

}
