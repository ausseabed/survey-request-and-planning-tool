import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne,
  JoinTable, OneToMany} from "typeorm";

import { DateTransformer } from './utils';

import { HippRequestAttachment } from './hipp-request-attachment';
import { Organisation } from './organisation';


@Entity()
export class HippRequest {

  @PrimaryGeneratedColumn('uuid')
  id;

  @Column("varchar")
  name;

  @ManyToOne(
    type => Organisation,
    organisation => organisation.requestingAgencyHipp,
    { nullable: true })
  requestingAgency;

  @Column({
      type:"varchar",
      nullable: true,
  })
  requestorName;

  @Column({
      type:"varchar",
      nullable: true,
  })
  pointOfContactDetails;

  //stored as date type in the database, but transformer handles marshalling
  // to/from the database and the UTC millisecond ints used by the web services
  @Column({
      type:"timestamp with time zone",
      transformer: new DateTransformer()
  })
  requestDate;

  @Column({
      type:"varchar",
      nullable: true,
  })
  areaName;

  @Column({
      type:"varchar",
      nullable: true,
  })
  area;

  @Column({
      type:"varchar",
      nullable: true,
  })
  businessJustification;

  @Column({
      type:"varchar",
      nullable: true,
  })
  costBenefit;

  @Column({
      type:"bool",
      nullable: false,
      default: false,
  })
  deleted = false;

  @OneToMany(
    type => HippRequestAttachment,
    attachment => attachment.entity)
  attachments;
}
