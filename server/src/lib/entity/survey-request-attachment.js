import {Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne,
  ManyToOne} from "typeorm";

import { DateTransformer } from './utils';

import { Attachment } from './attachment';
import { SurveyRequest } from './survey-request';

@Entity()
export class SurveyRequestAttachment {

  @PrimaryGeneratedColumn('uuid')
  id;

  @ManyToOne(type => SurveyRequest, entity => entity.attachments)
  @JoinColumn()
  entity;

  @OneToOne(type => Attachment)
  @JoinColumn()
  attachment;

}
