import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn }
  from "typeorm";

import { DeliverableDefinition } from './deliverable-definition';
import { ProjectMetadata } from './project-metadata';

@Entity()
export class SurveyDeliverable {

  @PrimaryGeneratedColumn('uuid')
  id = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  name = undefined;

  @Column({
    type: "json",
    nullable: true
  })
  data = undefined;

  @Column("uuid")
  definitionId;

  @ManyToOne(
    type => DeliverableDefinition,
    delDefn => delDefn.deliverables)
  @JoinColumn({ name: "definitionId" })
  definition;

  @Column("uuid")
  projectMetadataId;

  @ManyToOne(
    type => ProjectMetadata,
    pmd => pmd.deliverables)
  @JoinColumn({ name: "projectMetadataId" })
  projectMetadata;
}
