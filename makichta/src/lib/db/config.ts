import "dotenv/config";

type DbEngine = "sqlite" | "mysql";

function getEngine(): DbEngine {
  const conn = process.env.DB_CONNECTION?.toLowerCase();
  if (conn === "sqlite" || conn === "mysql") {
    return conn;
  }
  return process.env.NODE_ENV === "production" ? "mysql" : "sqlite";
}

function buildDatabaseUrl(engine: DbEngine): string {
  if (engine === "sqlite") {
    const path = process.env.SQLITE_PATH || "prisma/dev.db";
    return `file:${path}`;
  }
  const host = process.env.DB_HOST || "localhost";
  const port = process.env.DB_PORT || "3306";
  const name = process.env.DB_NAME ?? "";
  const user = process.env.DB_USER ?? "";
  const password = process.env.DB_PASSWORD ?? "";
  const encodedPassword = encodeURIComponent(password);
  return `mysql://${user}:${encodedPassword}@${host}:${port}/${name}`;
}

export function loadDatabaseConfig(): { engine: DbEngine; databaseUrl: string } {
  const engine = getEngine();
  const databaseUrl = buildDatabaseUrl(engine);

  process.env.DATABASE_URL = databaseUrl;

  const logPrefix = "[DB]";
  if (engine === "sqlite") {
    console.log(`${logPrefix} Using SQLite`);
  } else {
    const host = process.env.DB_HOST || "localhost";
    console.log(`${logPrefix} Using MySQL (${host})`);
  }

  return { engine, databaseUrl };
}

loadDatabaseConfig();
