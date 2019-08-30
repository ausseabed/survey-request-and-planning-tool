import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany,
  JoinTable} from "typeorm";

import { SurveyPlan } from './survey-plan';
import { SurveyDeliverable } from './survey-deliverable';
import { TechSpec }
  from './tech-spec';

@Entity()
export class DeliverableDefinition {

  @PrimaryGeneratedColumn('uuid')
  id = undefined;

  @Column("varchar")
  name = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  description = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  group = undefined;

  @OneToMany(
    type => DeliverableDefinitionField,
    field => field.deliverableDefinition)
  fields;

  @OneToMany(
    type => SurveyDeliverable,
    sd => sd.definition)
  deliverables;
}


@Entity()
export class DeliverableDefinitionField {

  @PrimaryGeneratedColumn('uuid')
  id = undefined;

  @Column("varchar")
  name = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  label = undefined;

  @Column("varchar")
  type = undefined;

  @Column("varchar", {
    array: true,
    nullable: true,
  })
  options = [];

  @ManyToOne(
    type => DeliverableDefinition,
    delDefn => delDefn.fields)
  deliverableDefinition;

}
