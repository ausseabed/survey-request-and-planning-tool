import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne,
  } from "typeorm";

import { DateTransformer } from './utils';

export const REPORT_TEMPLATE_TYPES = [
  "HIPP Request",
  "Plan",
];

@Entity()
export class ReportTemplate {

  @PrimaryGeneratedColumn('uuid')
  id;

  @Column("varchar")
  name;

  @Column("varchar")
  fileName;

  @Column("varchar")
  mimeType;

  @Column("varchar")
  templateType;

  @Column({
      type:"bool",
      nullable: false,
      default: true,
  })
  active = true;

  @Column("varchar")
  storage; // aws or db

  @Column({
    type:"varchar",
    nullable: true,
  })
  awsUrl;

  @Column("bytea", {true: false, select: false})
  blob;

  @Column({
      type:"timestamp with time zone",
      transformer: new DateTransformer(),
      nullable: true,
  })
  created;

  @Column({
      type:"bool",
      nullable: false,
      default: true,
  })
  valid;

  @Column({
    type: "json",
    nullable: true
  })
  parameters = undefined;

  @Column({
    type: "json",
    nullable: true
  })
  errors = undefined;
}
