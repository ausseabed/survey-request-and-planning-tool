import {Entity, PrimaryGeneratedColumn, Column, OneToMany,
  ManyToOne} from "typeorm";

import { PriorityArea } from './priority-area';
import { Organisation } from './priority-area';

@Entity()
export class PriorityAreaSubmission {

  @PrimaryGeneratedColumn('uuid')
  id;

  @ManyToOne(
    type => Organisation,
    nullable: true,
    organisation => organisation.priorityAreaSubmissions
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
    nullable: true,
    organisation => organisation.priorityAreaCitations
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

  @ManyToOne(
    type => Custodian,
    nullable: true,
    custodian => custodian.priorityAreaSubmissions
  )
  custodian;

  @OneToMany(
    type => PriorityArea,
    priorityArea => priorityArea.priorityAreaSubmissionSubmission
  )
  priorityAreas;

  @OneToOne(
    type => RecordState,
    { cascade: true }
  )
  @JoinColumn()
  recordState;
}
