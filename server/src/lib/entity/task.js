import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

import { DateTransformer } from './utils';

// Represents a processing task. Entity is used to track the progress and
// status of background processing tasks being performed.
// Examples include:
//   - Generation of thumbnail images from uploaded data

@Entity()
export class Task {

  @PrimaryGeneratedColumn('uuid')
  id = undefined;

  @Column({
    type: "enum",
    nullable: false,
    enum: ["NOT_STARTED", "STARTED", "COMPLETED", "FAILED"],
    default: "NOT_STARTED"
  })
  state;

  @Column({
    name: "progress_type",
    nullable: false,
    type: "enum",
    enum: ["INDETERMINATE", "PERCENT"],
    default: "INDETERMINATE"
  })
  progressType;

  @Column({
    type: "int",
    nullable: false,
    default: 0
  })
  progress;

  @Column("varchar", {
    name: "status_message",
    nullable: true
  })
  statusMessage;

  @Column("varchar", {
    name: "error_message",
    nullable: true
  })
  errorMessage;

  @Column({
    name: "last_updated",
    type:"timestamp with time zone",
    default: () => 'CURRENT_TIMESTAMP',
    transformer: new DateTransformer(),
    nullable: true,
  })
  lastUpdated;

  // a blob of data that may be processed by the task
  @Column("bytea", {
    nullable: true,
    select: false,
  })
  blob;

  @Column({
    name: "blob_file_name",
    type:"varchar",
    nullable: true,
  })
  blobFileName;

}
