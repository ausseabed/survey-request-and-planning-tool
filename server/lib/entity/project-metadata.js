import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class ProjectMetadata {

    @PrimaryGeneratedColumn('uuid')
    id = undefined;

    @Column("varchar")
    surveyName = "";

}
