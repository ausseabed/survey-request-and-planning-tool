import {Entity, PrimaryGeneratedColumn, Column, OneToMany,
  ManyToOne, OneToOne, JoinColumn} from "typeorm";

import { DateTransformer } from './utils';

import { Custodian } from './custodian';
import { Organisation } from './organisation';
import { PriorityArea } from './priority-area';
import { RecordState } from './record-state';
import { Task } from './task';

@Entity()
export class PriorityAreaSubmission {

  @PrimaryGeneratedColumn('uuid')
  id;

  @ManyToOne(
    type => Organisation,
    organisation => organisation.priorityAreaSubmissions,
    { nullable: true }
  )
  submittingOrganisation;

  @Column({
      type:"varchar",
      nullable: true,
  })
  contactPerson;

  @Column({
      type:"varchar",
      nullable: true,
  })
  contactEmail;

  @Column({
      type:"bool",
      nullable: true,
  })
  citation;

  @ManyToOne(
    type => Organisation,
    organisation => organisation.priorityAreaCitations,
    { nullable: true }
  )
  citedOrganisation;

  @Column({
      type:"varchar",
      nullable: true,
  })
  citedContactName;

  @Column({
      type:"varchar",
      nullable: true,
  })
  citedContactEmail;

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

  @Column({
      type:"timestamp with time zone",
      default: () => 'CURRENT_TIMESTAMP',
      transformer: new DateTransformer(),
      nullable: false,
  })
  created;

  @Column({
      type:"timestamp with time zone",
      default: () => 'CURRENT_TIMESTAMP',
      transformer: new DateTransformer(),
      nullable: true,
  })
  lastModified;

  @ManyToOne(
    type => Custodian,
    custodian => custodian.priorityAreaSubmissions,
    { nullable: true }
  )
  custodian;

  @OneToMany(
    type => PriorityArea,
    priorityArea => priorityArea.priorityAreaSubmissionSubmission,
    { cascade: true }
  )
  priorityAreas;

  @OneToOne(
    type => RecordState,
    {
      cascade: true,
      nullable: true
    }
  )
  @JoinColumn()
  recordState;

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

}
