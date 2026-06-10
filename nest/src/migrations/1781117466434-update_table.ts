import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTable1781117466434 implements MigrationInterface {
    name = 'UpdateTable1781117466434'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "status_colors" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "id_status" integer NOT NULL, "color" varchar NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "status_colors"`);
    }

}
