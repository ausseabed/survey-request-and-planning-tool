import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne,
  } from "typeorm";

import { DateTransformer } from './utils';

export const DOCUMENT_TYPES = [
  "User Guide",
];

@Entity()
export class Document {

  @PrimaryGeneratedColumn('uuid')
  id;

  @Column("varchar")
  name;

  @Column("varchar")
  documentType;

  @Column("varchar")
  fileName;

  @Column("varchar")
  mimeType;

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

}
