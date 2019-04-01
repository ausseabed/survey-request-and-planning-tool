import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable }
  from "typeorm";

import { DataCaptureType } from './data-capture-type';
import { ProjectMetadata } from './project-metadata';

@Entity()
export class InstrumentType {

  @PrimaryGeneratedColumn('uuid')
  id = undefined;

  @Column("varchar")
  name = undefined;

  @Column("bool")
  userSubmitted = true;

  // List of what data capture types are supported by this instrument type.
  @ManyToMany(
    type => DataCaptureType,
    dataCaptureType => dataCaptureType.instrumentTypes)
  @JoinTable()
  dataCaptureTypes;

  @ManyToMany(
    type => ProjectMetadata,
    projectMetadata => projectMetadata.instrumentTypes)
  projectMetadatas;
}
