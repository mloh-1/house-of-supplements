import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
  console.error("Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set");
  process.exit(1);
}

const client = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});

async function main() {
  console.log("Creating admin user...");

  const password = await bcrypt.hash("admin", 10);
  const id = "admin_" + Date.now();
  const now = new Date().toISOString();

  try {
    await client.execute({
      sql: `INSERT INTO "User" ("id", "email", "emailVerified", "password", "name", "role", "createdAt", "updatedAt")
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, "admin@gmail.com", now, password, "Admin", "ADMIN", now, now],
    });
    console.log("✓ Admin user created successfully!");
    console.log("  Email: admin@gmail.com");
    console.log("  Password: admin");
  } catch (error) {
    if (error.message?.includes("UNIQUE constraint failed")) {
      console.log("○ Admin user already exists");
    } else {
      console.error("✗ Error creating admin user:", error.message);
    }
  }
}

main().catch(console.error);
