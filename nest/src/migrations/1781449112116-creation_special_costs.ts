import { MigrationInterface, QueryRunner } from "typeorm";

export class CreationSpecialCosts1781449112116 implements MigrationInterface {
    name = 'CreationSpecialCosts1781449112116'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "special_costs" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "id_ticket" integer NOT NULL, "item_type" varchar NOT NULL, "category" varchar NOT NULL, "created" datetime NOT NULL DEFAULT (datetime('now')), "value" double NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "special_costs"`);
    }

}
