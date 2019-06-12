import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany,
  JoinTable} from "typeorm";

import { HippRequest } from './hipp-request';
import { ProjectMetadata } from './project-metadata';
import { TechSpec } from './tech-spec';
import { User } from './user'

@Entity()
export class Organisation {

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
    type => ProjectMetadata,
    projectMetadata => projectMetadata.organisations)
  projectMetadatas;

  @ManyToMany(
    type => HippRequest,
    hippRequest => hippRequest.requestingAgencies)
  requestingAgenciesHipp;

  @OneToMany(type => User, user => user.organisation)
  users;
}
