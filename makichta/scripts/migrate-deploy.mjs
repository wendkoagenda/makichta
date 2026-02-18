import "dotenv/config";
import { execSync } from "child_process";
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

function buildDatabaseUrl(engine) {
  if (engine === "sqlite") {
    const dbPath = process.env.SQLITE_PATH || "prisma/dev.db";
    return `file:${dbPath}`;
  }
  const host = process.env.DB_HOST || "localhost";
  const port = process.env.DB_PORT || "3306";
  const name = process.env.DB_NAME ?? "";
  const user = process.env.DB_USER ?? "";
  const password = process.env.DB_PASSWORD ?? "";
  const encodedPassword = encodeURIComponent(password);
  return `mysql://${user}:${encodedPassword}@${host}:${port}/${name}`;
}

const engine = getEngine();

if (process.env.NODE_ENV !== "production") {
  console.log("[migrate-deploy] Skipping (not production).");
  process.exit(0);
}

process.env.DATABASE_URL = buildDatabaseUrl(engine);

if (engine === "mysql") {
  console.log("[migrate-deploy] Pushing schema to MySQL...");
  execSync("npx prisma db push", {
    stdio: "inherit",
    cwd: path.join(__dirname, ".."),
  });
} else {
  console.log("[migrate-deploy] Applying migrations (SQLite)...");
  execSync("npx prisma migrate deploy", {
    stdio: "inherit",
    cwd: path.join(__dirname, ".."),
  });
}
console.log("[migrate-deploy] Done.");
