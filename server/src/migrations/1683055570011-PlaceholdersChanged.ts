import { MigrationInterface, QueryRunner } from "typeorm";

export class PlaceholdersChanged1683055570013 implements MigrationInterface {
  name = "PlaceholdersChanged1683055570013";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post" ALTER COLUMN "imageUrl" SET DEFAULT ' https://via.placeholder.com/600'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post" ALTER COLUMN "imageUrl" SET DEFAULT ' https://via.placeholder.com/300x150'`
    );
  }
}
