import mysql from "mysql2/promise";

declare global {
  var __mysqlPool: mysql.Pool | undefined;
}

const dbConfig = {
  host: process.env.DB_HOST ?? "127.0.0.1",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? "sknat_user",
  password: process.env.DB_PASSWORD ?? "sknat_pass123",
  database: process.env.DB_NAME ?? "sknat_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

export const dbPool =
  global.__mysqlPool ??
  mysql.createPool({
    ...dbConfig,
    charset: "utf8mb4",
  });

if (process.env.NODE_ENV !== "production") {
  global.__mysqlPool = dbPool;
}
