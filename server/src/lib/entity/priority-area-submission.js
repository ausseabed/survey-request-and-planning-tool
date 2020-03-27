import {Entity, PrimaryGeneratedColumn, Column, OneToMany,
  ManyToOne, OneToOne, JoinColumn} from "typeorm";

import { Custodian } from './custodian';
import { Organisation } from './organisation';
import { PriorityArea } from './priority-area';
import { RecordState } from './record-state';

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

  @ManyToOne(
    type => Custodian,
    custodian => custodian.priorityAreaSubmissions,
    { nullable: true }
  )
  custodian;

  @OneToMany(
    type => PriorityArea,
    priorityArea => priorityArea.priorityAreaSubmissionSubmission
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
}
