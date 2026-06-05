import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhoneNumberToUser1780571576854 implements MigrationInterface {
    name = 'AddPhoneNumberToUser1780571576854'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "articles" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "articles"`);
    }

}
