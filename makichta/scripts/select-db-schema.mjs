import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getEngine() {
  const conn = process.env.DB_CONNECTION?.toLowerCase();
  if (conn === "sqlite" || conn === "mysql") {
    return conn;
  }
  return process.env.NODE_ENV === "production" ? "mysql" : "sqlite";
}

const engine = getEngine();
const prismaDir = path.join(__dirname, "..", "prisma");
const sourcePath = path.join(
  prismaDir,
  engine === "sqlite" ? "schema.sqlite.prisma" : "schema.mysql.prisma"
);
const targetPath = path.join(prismaDir, "schema.prisma");

fs.copyFileSync(sourcePath, targetPath);
console.log(`[select-db-schema] Using schema: ${engine}`);
