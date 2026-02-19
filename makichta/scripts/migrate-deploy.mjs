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

function maskUrl(url) {
  return url.replace(/:([^@]+)@/, ":****@");
}

console.log("=== [migrate-deploy] START ===");
console.log(`[migrate-deploy] NODE_ENV     = ${process.env.NODE_ENV}`);
console.log(`[migrate-deploy] DB_CONNECTION = ${process.env.DB_CONNECTION ?? "(not set)"}`);

const engine = getEngine();
console.log(`[migrate-deploy] Engine       = ${engine}`);

if (process.env.NODE_ENV !== "production") {
  console.log("[migrate-deploy] Skipping (not production).");
  console.log("=== [migrate-deploy] END ===");
  process.exit(0);
}

// DEBUG: logs en clair — remettre le masquage après diagnostic
if (engine === "mysql") {
  console.log(`[migrate-deploy] DB_HOST      = ${process.env.DB_HOST ?? "(not set)"}`);
  console.log(`[migrate-deploy] DB_PORT      = ${process.env.DB_PORT ?? "(not set, default 3306)"}`);
  console.log(`[migrate-deploy] DB_NAME      = ${process.env.DB_NAME ?? "(not set)"}`);
  console.log(`[migrate-deploy] DB_USER      = ${process.env.DB_USER ?? "(not set)"}`);
  console.log(`[migrate-deploy] DB_PASSWORD  = ${process.env.DB_PASSWORD ?? "(not set)"}`);
}

const url = buildDatabaseUrl(engine);
process.env.DATABASE_URL = url;
console.log(`[migrate-deploy] DATABASE_URL = ${url}`);

const schemaPath = path.join(__dirname, "..", "prisma", "schema.prisma");
console.log(`[migrate-deploy] Schema       = ${schemaPath}`);

try {
  if (engine === "mysql") {
    console.log("[migrate-deploy] Running: prisma db push ...");
    execSync("npx prisma db push --accept-data-loss", {
      stdio: "inherit",
      cwd: path.join(__dirname, ".."),
    });
    console.log("[migrate-deploy] prisma db push completed successfully.");
  } else {
    console.log("[migrate-deploy] Running: prisma migrate deploy ...");
    execSync("npx prisma migrate deploy", {
      stdio: "inherit",
      cwd: path.join(__dirname, ".."),
    });
    console.log("[migrate-deploy] prisma migrate deploy completed successfully.");
  }
} catch (err) {
  console.error("=== [migrate-deploy] FAILED ===");
  console.error(`[migrate-deploy] Exit code: ${err.status}`);
  console.error(`[migrate-deploy] Error: ${err.message}`);
  process.exit(1);
}

console.log("=== [migrate-deploy] END (success) ===");
