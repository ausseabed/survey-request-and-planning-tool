import {Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne,
  ManyToOne} from "typeorm";

import { DateTransformer } from './utils';

import { Attachment } from './attachment';
import { SurveyPlan } from './survey-plan';

@Entity()
export class SurveyAttachment {

  @PrimaryGeneratedColumn('uuid')
  id;

  @ManyToOne(type => SurveyPlan, entity => entity.attachments)
  @JoinColumn()
  entity;

  @OneToOne(type => Attachment)
  @JoinColumn()
  attachment;

}
