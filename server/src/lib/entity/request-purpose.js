import {Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";

import { HippRequest } from './hipp-request';

@Entity()
export class RequestPurpose {

  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({
      type:"varchar",
      nullable: false,
  })
  name;

  @Column({
      type:"varchar",
      nullable: false,
  })
  group;

  @Column({
      type:"int",
      nullable: false,
  })
  groupOrder;

  @ManyToMany(
    type => HippRequest,
    hippRequest => hippRequest.purposes)
  requests;

}