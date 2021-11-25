import {
  Entity, PrimaryGeneratedColumn, Column, OneToMany,
  ManyToOne, OneToOne, JoinColumn
} from "typeorm";

import { DateTransformer } from './utils';

import { Custodian } from './custodian';
import { Organisation } from './organisation';
import { PriorityArea } from './priority-area';
import { RecordState } from './record-state';
import { Task } from './task';


export const IDENTIFIED_AREA_NAME_SUGGESTIONS = [
  'Perth Canyon',
  'Joe\'s Reef',
  'ident placeholder name 1',
  'ident placeholder name 2',
];

export const GEOGRAPHICAL_AREA_NAME_SUGGESTIONS = [
  'geo placeholder name 1',
  'geo placeholder name 2',
];

export const SEACOUNTRY_NAME_SUGGESTIONS = [
  'Seacountry placeholder name 1',
  'Seacountry placeholder name 2',
  'Seacountry placeholder name 3',
];

export const ECOLOGICAL_AREA_SUGGESTIONS = [
  'Ecological area placeholder name 1',
  'Ecological area placeholder name 2',
  'Ecological area placeholder name 3',
];

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
    type: "varchar",
    nullable: true,
  })
  contactPerson;

  @Column({
    type: "varchar",
    nullable: true,
  })
  contactEmail;

  @Column({
    type: "varchar",
    nullable: true,
  })
  identifiedAreaName;

  @Column({
    type: "varchar",
    nullable: true,
  })
  geographicalAreaName;

  @Column({
    type: "varchar",
    nullable: true,
  })
  riskIssues;

  @Column({
    type: "varchar",
    nullable: true,
  })
  furtherInformation;

  @Column({
    type: "timestamp with time zone",
    default: () => 'CURRENT_TIMESTAMP',
    transformer: new DateTransformer(),
    nullable: false,
  })
  created;

  @Column({
    type: "timestamp with time zone",
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
    type: "uuid",
    name: "upload_task_id",
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
