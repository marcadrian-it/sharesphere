import "reflect-metadata";
import { DataSource } from "typeorm";
import "dotenv-safe/config";

export const MyPostgresDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  port: 5432,
  logging: true,
  synchronize: false, // turn back to false on PROD
  entities: ["dist/entities/*.js"],
  subscribers: [],
  migrations: ["dist/migrations/*.js"],
  migrationsTableName: "migrations",
});
