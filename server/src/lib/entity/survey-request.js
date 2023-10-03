import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne,
  JoinTable, OneToMany, OneToOne, JoinColumn } from "typeorm";

import { DateTransformer } from './utils';

import { Attachment } from './attachment';
import { Custodian } from './custodian';
import { SurveyRequestAttachment } from './survey-request-attachment';
import { SurveyRequestAoi } from './survey-request-aoi';
import { Organisation } from './organisation';
import { RecordState } from './record-state';
import { Task } from './task';


@Entity()
export class SurveyRequest {

  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({
      type:"varchar",
      nullable: true,
  })
  name;

  @ManyToMany(
    type => Custodian,
    custodian => custodian.custodiansHipp)
  @JoinTable()
  custodians;

  @ManyToOne(
    type => Organisation,
    {
      nullable: true
    }
  )
  @JoinColumn({ name: "organisation_id" })
  organisation;

  @ManyToMany(
    type => Organisation,
    organisation => organisation.surveyRequests)
  @JoinTable()
  organisations;

  @Column({
      type:"varchar",
      nullable: true,
  })
  requestorName;

  @Column({
      type:"varchar",
      nullable: true,
  })
  requestorPosition;

  @Column({
      type:"varchar",
      nullable: true,
  })
  pointOfContactEmail;

  @Column({
      type:"varchar",
      nullable: true,
  })
  businessJustification;

  @Column({
      type:"varchar",
      nullable: true,
  })
  costBenefit;

  @OneToOne(
    type => Attachment,
    {
      nullable: true
    }
  )
  @JoinColumn()
  businessCaseAttachment;

  @Column({
      type:"bool",
      nullable: false,
      default: false,
  })
  additionalFundingAvailable;

  @Column({
      type:"varchar",
      nullable: true,
  })
  riskIssues;

  @Column({
      type:"varchar",
      nullable: true,
  })
  furtherInformation;

  @OneToMany(
    type => SurveyRequestAttachment,
    attachment => attachment.entity)
  attachments;

  @OneToOne(type => RecordState, { cascade: true })
  @JoinColumn()
  recordState;

  @Column({
      type:"bool",
      nullable: false,
      default: false,
  })
  public = false;

  @OneToMany(
    type => SurveyRequestAoi,
    surveyRequestAoi => surveyRequestAoi.surveyRequest,
    { cascade: true }
  )
  aois;

  @Column({
      type:"uuid",
      name:"upload_task_id",
      nullable: true,
  })
  uploadTaskId;

  @OneToOne(
    type => Task,
    {
      cascade: true,
      nullable: true
    }
  )
  @JoinColumn({ name: "upload_task_id" })
  uploadTask;

  @Column({
      type:"bool",
      nullable: false,
      default: false,
  })
  deleted = false;
}
