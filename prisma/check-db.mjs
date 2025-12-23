import { createClient } from "@libsql/client";

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

const client = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});

async function main() {
  console.log("=== Checking Users ===");
  const users = await client.execute('SELECT id, email, emailVerified, role FROM "User"');
  console.log(users.rows);

  console.log("\n=== Checking Verification Tokens ===");
  const tokens = await client.execute('SELECT * FROM "VerificationToken"');
  console.log(tokens.rows);
}

main().catch(console.error);
