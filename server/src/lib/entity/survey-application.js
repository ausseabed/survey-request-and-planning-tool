import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany,
  JoinTable} from "typeorm";

import { SurveyPlan } from './survey-plan';

@Entity()
export class SurveyApplication {

  @PrimaryGeneratedColumn('uuid')
  id = undefined;

  @Column("varchar")
  name = undefined;

  @Column("varchar")
  group = undefined;

  @Column({
    type: "bool",
    default: false
  })
  userSubmitted = false;

  @Column("bool")
  deleted = false;

  @Column({
    type: "json",
    nullable: true
  })
  defaults = undefined;

  @OneToMany(
    type => SurveyPlan,
    surveyPlan => surveyPlan.surveyApplication)
  surveyPlans;

}
