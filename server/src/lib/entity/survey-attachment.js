import {Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne,
  ManyToOne} from "typeorm";

import { DateTransformer } from './utils';

import { Attachment } from './attachment';
import { ProjectMetadata } from './project-metadata';

@Entity()
export class SurveyAttachment {

  @PrimaryGeneratedColumn('uuid')
  id;

  @ManyToOne(type => ProjectMetadata, entity => entity.attachments)
  @JoinColumn()
  entity;

  @OneToOne(type => Attachment)
  @JoinColumn()
  attachment;

}
