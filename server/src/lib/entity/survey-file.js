import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne,
  } from "typeorm";

import { DateTransformer } from './utils';
import { ProjectMetadata } from './project-metadata';

@Entity()
export class SurveyFile {

  @PrimaryGeneratedColumn('uuid')
  id;

  @ManyToOne(
    type => ProjectMetadata,
    projectMetadata => projectMetadata.files,
    { nullable: true })
  projectMetadata;

  @Column("varchar")
  fileName;

  @Column("varchar")
  storage; // aws or db

  @Column({
    type:"varchar",
    nullable: true,
  })
  awsUrl;

  @Column("bytea", {nullable: false, select: false})
  blob;

  @Column({
      type:"timestamp with time zone",
      transformer: new DateTransformer(),
      nullable: true,
  })
  created;
}
