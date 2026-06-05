import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCategoryColumn1780576791707 implements MigrationInterface {
    name = 'UpdateCategoryColumn1780576791707'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_articles" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" text NOT NULL, "categoryId" integer)`);
        await queryRunner.query(`INSERT INTO "temporary_articles"("id", "name", "description", "categoryId") SELECT "id", "name", "description", "categoryId" FROM "articles"`);
        await queryRunner.query(`DROP TABLE "articles"`);
        await queryRunner.query(`ALTER TABLE "temporary_articles" RENAME TO "articles"`);
        await queryRunner.query(`CREATE TABLE "temporary_categories" ("id" integer PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "created" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "temporary_categories"("id", "name", "created") SELECT "id", "name", "created" FROM "categories"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`ALTER TABLE "temporary_categories" RENAME TO "categories"`);
        await queryRunner.query(`CREATE TABLE "temporary_articles" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" text NOT NULL, "categoryId" integer, CONSTRAINT "FK_9cf383b5c60045a773ddced7f23" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_articles"("id", "name", "description", "categoryId") SELECT "id", "name", "description", "categoryId" FROM "articles"`);
        await queryRunner.query(`DROP TABLE "articles"`);
        await queryRunner.query(`ALTER TABLE "temporary_articles" RENAME TO "articles"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" RENAME TO "temporary_articles"`);
        await queryRunner.query(`CREATE TABLE "articles" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" text NOT NULL, "categoryId" integer)`);
        await queryRunner.query(`INSERT INTO "articles"("id", "name", "description", "categoryId") SELECT "id", "name", "description", "categoryId" FROM "temporary_articles"`);
        await queryRunner.query(`DROP TABLE "temporary_articles"`);
        await queryRunner.query(`ALTER TABLE "categories" RENAME TO "temporary_categories"`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" integer PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "created" datetime NOT NULL)`);
        await queryRunner.query(`INSERT INTO "categories"("id", "name", "created") SELECT "id", "name", "created" FROM "temporary_categories"`);
        await queryRunner.query(`DROP TABLE "temporary_categories"`);
        await queryRunner.query(`ALTER TABLE "articles" RENAME TO "temporary_articles"`);
        await queryRunner.query(`CREATE TABLE "articles" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" text NOT NULL, "categoryId" integer, CONSTRAINT "FK_9cf383b5c60045a773ddced7f23" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "articles"("id", "name", "description", "categoryId") SELECT "id", "name", "description", "categoryId" FROM "temporary_articles"`);
        await queryRunner.query(`DROP TABLE "temporary_articles"`);
    }

}
