import {Entity, PrimaryColumn, Column} from "typeorm";

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
}
