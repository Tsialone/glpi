import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumn1781461806569 implements MigrationInterface {
    name = 'AddColumn1781461806569'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_special_costs" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "id_ticket" integer NOT NULL, "item_type" varchar NOT NULL, "category" varchar NOT NULL, "created" datetime NOT NULL DEFAULT (datetime('now')), "value" double NOT NULL, "id_item" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_special_costs"("id", "id_ticket", "item_type", "category", "created", "value") SELECT "id", "id_ticket", "item_type", "category", "created", "value" FROM "special_costs"`);
        await queryRunner.query(`DROP TABLE "special_costs"`);
        await queryRunner.query(`ALTER TABLE "temporary_special_costs" RENAME TO "special_costs"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "special_costs" RENAME TO "temporary_special_costs"`);
        await queryRunner.query(`CREATE TABLE "special_costs" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "id_ticket" integer NOT NULL, "item_type" varchar NOT NULL, "category" varchar NOT NULL, "created" datetime NOT NULL DEFAULT (datetime('now')), "value" double NOT NULL)`);
        await queryRunner.query(`INSERT INTO "special_costs"("id", "id_ticket", "item_type", "category", "created", "value") SELECT "id", "id_ticket", "item_type", "category", "created", "value" FROM "temporary_special_costs"`);
        await queryRunner.query(`DROP TABLE "temporary_special_costs"`);
    }

}
