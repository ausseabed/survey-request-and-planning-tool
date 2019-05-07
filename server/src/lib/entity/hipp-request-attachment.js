import {Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne,
  ManyToOne} from "typeorm";

import { DateTransformer } from './utils';

import { Attachment } from './attachment';
import { HippRequest } from './hipp-request';

@Entity()
export class HippRequestAttachment {

  @PrimaryGeneratedColumn('uuid')
  id;

  @ManyToOne(type => HippRequest, entity => entity.attachments)
  @JoinColumn()
  entity;

  @OneToOne(type => Attachment)
  @JoinColumn()
  attachment;

}
