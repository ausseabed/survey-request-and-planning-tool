import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable }
  from "typeorm";

import { SurveyRequest } from './survey-request';
import { InstrumentType } from './instrument-type';
import { SurveyPlan } from './survey-plan';

@Entity()
export class DataCaptureType {

  @PrimaryGeneratedColumn('uuid')
  id = undefined;

  @Column("varchar")
  name = undefined;

  @Column("bool")
  userSubmitted = true;

  // can this data capture type be linked to plans
  @Column({
      type:"bool",
      default: false,
  })
  appliesToPlan = true;

  // can this data capture type be linked to requests
  @Column({
      type:"bool",
      default: false,
  })
  appliesToRequest = true;

  // List of what instrument types can provide this data capture type.
  @ManyToMany(
    type => InstrumentType,
    instrumentType => instrumentType.dataCaptureTypes)
  instrumentTypes;

  @ManyToMany(
    type => SurveyPlan,
    surveyPlan => surveyPlan.dataCaptureTypes)
  surveyPlans;

}
