import { MigrationInterface, QueryRunner } from 'typeorm';

export class MenuItem1754766100077 implements MigrationInterface {
  name = 'MenuItem1754766100077';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ingredients" ("pkid" SERIAL NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version" integer NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(100) NOT NULL, "description" character varying(500) NOT NULL, "image" character varying(500), CONSTRAINT "UQ_9240185c8a5507251c9f15e0649" UNIQUE ("id"), CONSTRAINT "UQ_a955029b22ff66ae9fef2e161f8" UNIQUE ("name"), CONSTRAINT "PK_490cbcc91406f7b1a80e1f6ecdb" PRIMARY KEY ("pkid"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "menuitems" ("pkid" SERIAL NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version" integer NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(100) NOT NULL, "price" numeric(10,2) NOT NULL, "image" character varying(500), CONSTRAINT "UQ_bd3c6b9b69c56ca58c301f4f312" UNIQUE ("id"), CONSTRAINT "UQ_def25d54e1578ebd30bc0eadc02" UNIQUE ("name"), CONSTRAINT "PK_0a9ec8909d377da757f66109dbd" PRIMARY KEY ("pkid"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "menuitem_ingredients" ("menuitem_id" uuid NOT NULL, "ingredient_id" uuid NOT NULL, CONSTRAINT "PK_13c738d15c0f9fcfe0b369997bf" PRIMARY KEY ("menuitem_id", "ingredient_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6177978fb59f840d2d5f0e1c0f" ON "menuitem_ingredients" ("menuitem_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_777aff6fa813d26e831e4cf423" ON "menuitem_ingredients" ("ingredient_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "menuitem_ingredients" ADD CONSTRAINT "FK_6177978fb59f840d2d5f0e1c0f0" FOREIGN KEY ("menuitem_id") REFERENCES "menuitems"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "menuitem_ingredients" ADD CONSTRAINT "FK_777aff6fa813d26e831e4cf423e" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "menuitem_ingredients" DROP CONSTRAINT "FK_777aff6fa813d26e831e4cf423e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "menuitem_ingredients" DROP CONSTRAINT "FK_6177978fb59f840d2d5f0e1c0f0"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_777aff6fa813d26e831e4cf423"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6177978fb59f840d2d5f0e1c0f"`,
    );
    await queryRunner.query(`DROP TABLE "menuitem_ingredients"`);
    await queryRunner.query(`DROP TABLE "menuitems"`);
    await queryRunner.query(`DROP TABLE "ingredients"`);
  }
}
