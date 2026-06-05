import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCategories1780571949411 implements MigrationInterface {
    name = 'AddCategories1780571949411'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_articles" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" text NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_articles"("id", "name") SELECT "id", "name" FROM "articles"`);
        await queryRunner.query(`DROP TABLE "articles"`);
        await queryRunner.query(`ALTER TABLE "temporary_articles" RENAME TO "articles"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" RENAME TO "temporary_articles"`);
        await queryRunner.query(`CREATE TABLE "articles" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "articles"("id", "name") SELECT "id", "name" FROM "temporary_articles"`);
        await queryRunner.query(`DROP TABLE "temporary_articles"`);
    }

}
