import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

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

  // following attribs are all permissions related to what this role can do

  // Admin permissions
  @Column({type: "bool", nullable: false, default: false})
  isAdmin;

  @Column({type: "bool", nullable: false, default: false})
  canAddTemplate;

  @Column({type: "bool", nullable: false, default: false})
  canViewTemplate;

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

}
