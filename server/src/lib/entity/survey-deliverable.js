import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn }
  from "typeorm";

import { DeliverableDefinition } from './deliverable-definition';
import { SurveyPlan } from './survey-plan';

@Entity()
export class SurveyDeliverable {

  @PrimaryGeneratedColumn('uuid')
  id = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  name = undefined;

  @Column({
    type: "json",
    nullable: true
  })
  data = undefined;

  @Column("uuid")
  definitionId;

  @ManyToOne(
    type => DeliverableDefinition,
    delDefn => delDefn.deliverables)
  @JoinColumn({ name: "definitionId" })
  definition;

  @Column("uuid")
  surveyPlanId;

  @ManyToOne(
    type => SurveyPlan,
    pmd => pmd.deliverables)
  @JoinColumn({ name: "surveyPlanId" })
  surveyPlan;
}
