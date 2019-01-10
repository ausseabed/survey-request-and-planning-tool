import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable }
  from "typeorm";

import { ProjectMetadata } from './project-metadata';

@Entity()
export class InstrumentType {

  @PrimaryGeneratedColumn('uuid')
  id = undefined;

  @Column("varchar")
  name = undefined;

  @Column("bool")
  userSubmitted = true;

  @ManyToMany(
    type => ProjectMetadata,
    projectMetadata => projectMetadata.instrumentTypes)
  @JoinTable()
  projectMetadatas;
}
