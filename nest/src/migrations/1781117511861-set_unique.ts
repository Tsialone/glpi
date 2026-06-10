import { MigrationInterface, QueryRunner } from "typeorm";

export class SetUnique1781117511861 implements MigrationInterface {
    name = 'SetUnique1781117511861'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_status_colors" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "id_status" integer NOT NULL, "color" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_status_colors"("id", "id_status", "color") SELECT "id", "id_status", "color" FROM "status_colors"`);
        await queryRunner.query(`DROP TABLE "status_colors"`);
        await queryRunner.query(`ALTER TABLE "temporary_status_colors" RENAME TO "status_colors"`);
        await queryRunner.query(`CREATE TABLE "temporary_status_colors" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "id_status" integer NOT NULL, "color" varchar NOT NULL, CONSTRAINT "UQ_54e25129dd0f9d47eb3ac4e3b73" UNIQUE ("id_status"))`);
        await queryRunner.query(`INSERT INTO "temporary_status_colors"("id", "id_status", "color") SELECT "id", "id_status", "color" FROM "status_colors"`);
        await queryRunner.query(`DROP TABLE "status_colors"`);
        await queryRunner.query(`ALTER TABLE "temporary_status_colors" RENAME TO "status_colors"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "status_colors" RENAME TO "temporary_status_colors"`);
        await queryRunner.query(`CREATE TABLE "status_colors" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "id_status" integer NOT NULL, "color" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "status_colors"("id", "id_status", "color") SELECT "id", "id_status", "color" FROM "temporary_status_colors"`);
        await queryRunner.query(`DROP TABLE "temporary_status_colors"`);
        await queryRunner.query(`ALTER TABLE "status_colors" RENAME TO "temporary_status_colors"`);
        await queryRunner.query(`CREATE TABLE "status_colors" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "id_status" integer NOT NULL, "color" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "status_colors"("id", "id_status", "color") SELECT "id", "id_status", "color" FROM "temporary_status_colors"`);
        await queryRunner.query(`DROP TABLE "temporary_status_colors"`);
    }

}
