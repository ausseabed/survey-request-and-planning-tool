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
  canEditRole;

  // not used !!!!
  // Todo: remove
  @Column({type: "bool", nullable: false, default: false})
  canAddTemplate;

  @Column({type: "bool", nullable: false, default: false})
  canEditTemplate;

  @Column({type: "bool", nullable: false, default: false})
  canEditCustodian;

  @Column({type: "bool", nullable: false, default: false})
  canEditOrganisation;

  @Column({type: "bool", nullable: false, default: false})
  canEditUser;


  // SurveyPlan permissions
  @Column({type: "bool", nullable: false, default: false})
  canAddSurveyPlan;

  @Column({type: "bool", nullable: false, default: false})
  canViewAllSurveyPlans;

  @Column({type: "bool", nullable: false, default: false})
  canViewCustodianSurveyPlans;

  @Column({type: "bool", nullable: false, default: false})
  canEditAllSurveyPlans;

  @Column({type: "bool", nullable: false, default: false})
  canEditCustodianSurveyPlans;


  // HIPP Request permissions
  @Column({type: "bool", nullable: false, default: false})
  canAddSurveyRequest;

  @Column({type: "bool", nullable: false, default: false})
  canViewAllSurveyRequests;

  @Column({type: "bool", nullable: false, default: false})
  canViewCustodianSurveyRequests;

  @Column({type: "bool", nullable: false, default: false})
  canEditAllSurveyRequests;

  @Column({type: "bool", nullable: false, default: false})
  canEditCustodianSurveyRequests;

  @Column({type: "bool", nullable: false, default: false})
  canViewRiskPriority;


  // Attachment permissions. These apply to project and hipp requests
  @Column({type: "bool", nullable: false, default: false})
  canViewAllAttachments;

  @Column({type: "bool", nullable: false, default: false})
  canViewCustodianAttachments;

  @Column({type: "bool", nullable: false, default: false})
  canUploadAllAttachments;

  @Column({type: "bool", nullable: false, default: false})
  canUploadCustodianAttachments;

  @Column({type: "bool", nullable: false, default: false})
  canDeleteAllAttachments;

  @Column({type: "bool", nullable: false, default: false})
  canDeleteCustodianAttachments;


  // Record state permissions. These apply to project and hipp requests
  @Column({type: "bool", nullable: false, default: false})
  canFinaliseAllRecordState;

  @Column({type: "bool", nullable: false, default: false})
  canReviseAllRecordState;

  @Column({type: "bool", nullable: false, default: false})
  canAcceptAllRecordState;

  @Column({type: "bool", nullable: false, default: false})
  canRemoveAllRecordState;

  @Column({type: "bool", nullable: false, default: false})
  canFinaliseCustodianRecordState;

  @Column({type: "bool", nullable: false, default: false})
  canReviseCustodianRecordState;

  @Column({type: "bool", nullable: false, default: false})
  canAcceptCustodianRecordState;

  @Column({type: "bool", nullable: false, default: false})
  canRemoveCustodianRecordState;


  // Priority Area permissions
  @Column({type: "bool", nullable: false, default: false})
  canAddPriorityAreaSubmission;

  @Column({type: "bool", nullable: false, default: false})
  canViewAllPriorityAreaSubmissions;

  @Column({type: "bool", nullable: false, default: false})
  canViewCustodianPriorityAreaSubmissions;

  @Column({type: "bool", nullable: false, default: false})
  canEditAllPriorityAreaSubmissions;

  @Column({type: "bool", nullable: false, default: false})
  canEditCustodianPriorityAreaSubmission;

  @Column({type: "bool", nullable: false, default: false})
  canSubmitAllPriorityAreaSubmission;

  @Column({type: "bool", nullable: false, default: false})
  canSubmitCustodianPriorityAreaSubmission;

  @Column({type: "bool", nullable: false, default: false})
  canPublishAllPriorityAreaSubmission;

  @Column({type: "bool", nullable: false, default: false})
  canPublishCustodianPriorityAreaSubmission;

  @Column({type: "bool", nullable: false, default: false})
  canSetPriorityAreaNationalPriority;  // admin only type permission
}
