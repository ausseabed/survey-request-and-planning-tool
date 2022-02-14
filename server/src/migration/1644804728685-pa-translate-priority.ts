import { MigrationInterface, QueryRunner } from "typeorm";
const _ = require('lodash');

import { PriorityArea } from '../lib/entity/priority-area';

// special migration that translates the `priority` attribute previously entered by
// users into the `organisational_priority` attribute

export class paTranslatePriority1644804728685 implements MigrationInterface {
    name = 'paTranslatePriority1644804728685'

    public async up(queryRunner: QueryRunner): Promise<void> {
        let priorityAreas = await queryRunner.manager
            .getRepository(PriorityArea)
            .find({
                select: ["id", "priority", "organisationalPriority"]
            });

        for (const priorityArea of priorityAreas) {

            if (_.isNil(priorityArea.organisationalPriority) && !_.isNil(priorityArea.priority)) {
                console.log(`Updating priority area ${priorityArea.id} `);

                let orgPriority = undefined;
                if (priorityArea.priority == "1") {
                    orgPriority = "High"
                } else if (priorityArea.priority == "2") {
                    orgPriority = "Medium"
                } else if (priorityArea.priority == "3") {
                    orgPriority = "Low"
                }

                console.log(`  priority ${priorityArea.priority} to org priority  ${orgPriority}`);
                priorityArea.organisationalPriority = orgPriority;

                await queryRunner.manager.getRepository(PriorityArea)
                    .update(
                        priorityArea.id,
                        { organisationalPriority: orgPriority }
                    );

            }
        }

    }

    public async down(queryRunner: QueryRunner): Promise<void> {

    }

}
