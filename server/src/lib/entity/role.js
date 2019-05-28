import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";

import { User } from './user'

// Role determines what a user can/can't do in the application. New attribs
// will be added to this entity as new capability is added that need to be
// restricted

@Entity()
export class Role {

  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({
      type:"varchar",
      nullable: false,
  })
  name;

  @Column({
    type: "bool",
    nullable: false,
    default: false
  })
  deleted;

  // If a user logs into the application the first time they are given a
  // default role. This flag determines if this role is the default.
  @Column({
    type: "bool",
    nullable: false,
    default: false
  })
  isDefault;

  @OneToMany(type => User, user => user.role)
  users;

  // following attribs are all permissions related to what this role can do

  // Admin permissions
  @Column({type: "bool", nullable: false, default: false})
  isAdmin;

  @Column({type: "bool", nullable: false, default: false})
  canAddTemplate;

  @Column({type: "bool", nullable: false, default: false})
  canEditTemplate;

  @Column({type: "bool", nullable: false, default: false})
  canEditOrganisation;

  @Column({type: "bool", nullable: false, default: false})
  canEditUser;


  // Project permissions
  @Column({type: "bool", nullable: false, default: false})
  canAddProject;

  @Column({type: "bool", nullable: false, default: false})
  canViewAllProjects;

  @Column({type: "bool", nullable: false, default: false})
  canViewOrgProjects;

  @Column({type: "bool", nullable: false, default: false})
  canEditAllProjects;

  @Column({type: "bool", nullable: false, default: false})
  canEditOrgProjects;


  // HIPP Request permissions
  @Column({type: "bool", nullable: false, default: false})
  canAddHippRequest;

  @Column({type: "bool", nullable: false, default: false})
  canViewAllHippRequests;

  @Column({type: "bool", nullable: false, default: false})
  canViewOrgHippRequests;

  @Column({type: "bool", nullable: false, default: false})
  canEditAllHippRequests;

  @Column({type: "bool", nullable: false, default: false})
  canEditOrgHippRequests;


  // Attachment permissions. These apply to project and hipp requests
  @Column({type: "bool", nullable: false, default: false})
  canViewAllAttachments;

  @Column({type: "bool", nullable: false, default: false})
  canViewOrgAttachments;

  @Column({type: "bool", nullable: false, default: false})
  canUploadAllAttachments;

  @Column({type: "bool", nullable: false, default: false})
  canUploadOrgAttachments;

  @Column({type: "bool", nullable: false, default: false})
  canDeleteAllAttachments;

  @Column({type: "bool", nullable: false, default: false})
  canDeleteOrgAttachments;

}
