import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable }
  from "typeorm";

import { InstrumentType } from './instrument-type';
import { ProjectMetadata } from './project-metadata';

@Entity()
export class DataCaptureType {

  @PrimaryGeneratedColumn('uuid')
  id = undefined;

  @Column("varchar")
  name = undefined;

  @Column("bool")
  userSubmitted = true;

  // List of what instrument types can provide this data capture type.
  @ManyToMany(
    type => InstrumentType,
    instrumentType => instrumentType.dataCaptureTypes)
  instrumentTypes;

  @ManyToMany(
    type => ProjectMetadata,
    projectMetadata => projectMetadata.dataCaptureTypes)
  projectMetadatas;
}
