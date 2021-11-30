import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

import { PriorityArea } from './priority-area';

@Entity()
export class AreaOfInterestPurpose {

  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({
    type: "varchar",
    nullable: false,
  })
  name;

  @Column({
    type: "varchar",
    nullable: false,
  })
  flag;

  @Column({
    type: "varchar",
    nullable: false,
    name: "contextual_use"
  })
  contextualUse;

  @Column({
    type: "varchar",
    nullable: false,
  })
  value;

  @ManyToOne(
    type => PriorityArea,
    aoi => aoi.purposes
  )
  priorityArea;
}
