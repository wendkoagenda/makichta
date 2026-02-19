import "dotenv/config";

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (url) return url;
  const host = process.env.PG_HOST || "localhost";
  const port = process.env.PG_PORT || "5432";
  const database = process.env.PG_DATABASE ?? "makichta";
  const user = process.env.PG_USER ?? "";
  const password = process.env.PG_PASSWORD ?? "";
  const encodedPassword = encodeURIComponent(password);
  return `postgresql://${user}:${encodedPassword}@${host}:${port}/${database}`;
}

const databaseUrl = getDatabaseUrl();
process.env.DATABASE_URL = databaseUrl;

if (process.env.NODE_ENV !== "production") {
  console.log("[DB] Using PostgreSQL");
}
