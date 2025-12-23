import { createClient } from "@libsql/client";

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

const client = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});

const categories = [
  {
    name: "Proteini",
    slug: "proteini",
    subcategories: [
      { name: "Whey Protein", slug: "whey-protein" },
      { name: "Whey Izolat", slug: "whey-izolat" },
      { name: "Kazein", slug: "kazein" },
      { name: "Veganski Proteini", slug: "veganski-proteini" },
      { name: "Beef Protein", slug: "beef-protein" },
    ],
  },
  {
    name: "Aminokiseline",
    slug: "aminokiseline",
    subcategories: [
      { name: "BCAA", slug: "bcaa" },
      { name: "EAA", slug: "eaa" },
      { name: "Glutamin", slug: "glutamin" },
      { name: "L-Karnitin", slug: "l-karnitin" },
    ],
  },
  {
    name: "Kreatin",
    slug: "kreatin",
    subcategories: [
      { name: "Kreatin Monohidrat", slug: "kreatin-monohidrat" },
      { name: "Kreatin Kompleksi", slug: "kreatin-kompleksi" },
    ],
  },
  {
    name: "Vitamini",
    slug: "vitamini",
    subcategories: [
      { name: "Multivitamini", slug: "multivitamini" },
      { name: "Vitamin D", slug: "vitamin-d" },
      { name: "Omega 3", slug: "omega-3" },
      { name: "Magnezijum", slug: "magnezijum" },
    ],
  },
  {
    name: "Pre-Workout",
    slug: "pre-workout",
    subcategories: [],
  },
];

function generateId() {
  return 'cat_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

async function main() {
  console.log("Seeding categories...\n");

  const now = new Date().toISOString();
  let order = 0;

  for (const category of categories) {
    const parentId = generateId();

    try {
      // Insert parent category
      await client.execute({
        sql: `INSERT INTO "Category" ("id", "name", "slug", "parentId", "order", "createdAt", "updatedAt")
              VALUES (?, ?, ?, NULL, ?, ?, ?)`,
        args: [parentId, category.name, category.slug, order++, now, now],
      });
      console.log(`✓ Created category: ${category.name}`);

      // Insert subcategories
      for (const sub of category.subcategories) {
        const subId = generateId();
        await client.execute({
          sql: `INSERT INTO "Category" ("id", "name", "slug", "parentId", "order", "createdAt", "updatedAt")
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
          args: [subId, sub.name, sub.slug, parentId, order++, now, now],
        });
        console.log(`  ✓ Created subcategory: ${sub.name}`);
      }
    } catch (error) {
      if (error.message?.includes("UNIQUE constraint failed")) {
        console.log(`○ Category "${category.name}" already exists, skipping...`);
      } else {
        console.error(`✗ Error creating ${category.name}:`, error.message);
      }
    }
  }

  console.log("\n✓ Categories seeding complete!");

  // Show what was created
  console.log("\n=== Categories in database ===");
  const result = await client.execute('SELECT id, name, slug, parentId FROM "Category" ORDER BY "order"');
  console.table(result.rows);
}

main().catch(console.error);
