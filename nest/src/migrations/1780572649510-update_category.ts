import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCategory1780572649510 implements MigrationInterface {
    name = 'UpdateCategory1780572649510'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" integer PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "created" datetime NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
