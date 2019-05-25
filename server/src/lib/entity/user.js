import {Entity, PrimaryColumn, Column, ManyToOne} from "typeorm";

import { Organisation } from './organisation'
import { Role } from './role'

@Entity()
export class User {

  @PrimaryColumn('varchar')
  id = undefined;

  @Column("varchar")
  issuer = undefined;

  @Column("varchar")
  issuerSub = undefined;

  @Column("varchar")
  avatar = undefined;

  @Column("varchar")
  email = undefined;

  @Column("varchar")
  name = undefined;

  @Column("varchar")
  accessToken = undefined;

  @Column("varchar")
  refreshToken = undefined;

  @ManyToOne(type => Role, role => role.users)
  role;

  @ManyToOne(type => Organisation, org => org.users)
  organisation;
}
