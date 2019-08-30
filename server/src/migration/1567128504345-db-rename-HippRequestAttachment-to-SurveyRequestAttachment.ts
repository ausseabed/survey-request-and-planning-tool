import {MigrationInterface, QueryRunner} from "typeorm";

export class dbRenameHippRequestAttachmentToSurveyRequestAttachment1567128504345 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.renameTable("hipp_request_attachment", "survey_request_attachment");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.renameTable("survey_request_attachment", "hipp_request_attachment");
    }

}
