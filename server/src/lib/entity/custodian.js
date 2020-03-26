import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany,
  JoinTable} from "typeorm";

import { SurveyRequest } from './survey-request';
import { SurveyPlan } from './survey-plan';
import { TechSpec } from './tech-spec';
import { User } from './user'

@Entity()
export class Custodian {

  @PrimaryGeneratedColumn('uuid')
  id = undefined;

  @Column("varchar")
  name = undefined;

  @Column({
      type:"varchar",
      nullable: true,
  })
  abn = undefined;

  @Column({
      type:"bool",
      nullable: false,
      default: false,
  })
  deleted = false;

  @ManyToMany(
    type => SurveyPlan,
    surveyPlan => surveyPlan.custodians)
  surveyPlans;

  @ManyToMany(
    type => SurveyRequest,
    surveyRequest => surveyRequest.custodians)
  custodiansHipp;

  @OneToMany(
    type => PriorityAreaSubmission,
    priorityAreaSubmission => priorityAreaSubmission.custodian
  )
  priorityAreaSubmissions;

  @OneToMany(type => User, user => user.custodian)
  users;
}
