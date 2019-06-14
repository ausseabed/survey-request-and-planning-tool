import {Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne,
  JoinColumn }
  from "typeorm";

import { DateTransformer } from './utils';
import { User } from './user';

@Entity()
export class RecordState {

  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({
    type:"varchar",
    nullable: false,
  })
  state;

  @ManyToOne(type => User, user => user.recordStates)
  user;

  @Column({
    type:"timestamp with time zone",
    transformer: new DateTransformer(),
    nullable: true,
  })
  created;

  @Column({
    type:"int",
    nullable: true,
  })
  version;

  // "request" OR "plan"
  @Column({
    type:"varchar",
    nullable: false,
  })
  recordType;

  @Column({
    type:"varchar",
    nullable: true,
  })
  changeDescription;

  @OneToOne(type => RecordState, recordState => recordState.next, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  previous;

  @OneToOne(type => RecordState, recordState => recordState.previous, {
    nullable: true,
  })
  next;
}
