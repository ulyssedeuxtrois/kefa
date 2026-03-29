// Apply schema migration via Neon HTTP SQL API
const NEON_URL = "https://ep-divine-violet-agjael6h-pooler.c-2.eu-central-1.aws.neon.tech/sql";
const CONN_STRING = "postgresql://neondb_owner:npg_TLVHWEwn1N0K@ep-divine-violet-agjael6h-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require";

async function runSQL(query) {
  const res = await fetch(NEON_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Neon-Connection-String": CONN_STRING,
    },
    body: JSON.stringify({ query }),
  });
  const data = await res.json();
  if (data.message) throw new Error(data.message);
  return data;
}

async function main() {
  console.log("Adding new columns to Event...");

  const queries = [
    `ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "city" TEXT NOT NULL DEFAULT 'nice'`,
    `ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "capacity" INTEGER`,
    `ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "rsvpCount" INTEGER NOT NULL DEFAULT 0`,
    `ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "viewCount" INTEGER NOT NULL DEFAULT 0`,
    `ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "clickCount" INTEGER NOT NULL DEFAULT 0`,
    `ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "submitterName" TEXT`,
    `ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "submitterEmail" TEXT`,
    `ALTER TABLE "Event" ALTER COLUMN "organizerId" DROP NOT NULL`,
  ];

  for (const q of queries) {
    try {
      await runSQL(q);
      console.log("  ✓", q.substring(0, 60) + "...");
    } catch (e) {
      console.log("  ⚠", e.message, "—", q.substring(0, 40));
    }
  }

  console.log("\nCreating Rsvp table...");
  await runSQL(`
    CREATE TABLE IF NOT EXISTS "Rsvp" (
      "id" TEXT NOT NULL,
      "eventId" TEXT NOT NULL,
      "name" TEXT,
      "sessionId" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Rsvp_pkey" PRIMARY KEY ("id")
    )
  `);
  console.log("  ✓ Rsvp table created");

  try {
    await runSQL(`ALTER TABLE "Rsvp" ADD CONSTRAINT "Rsvp_eventId_sessionId_key" UNIQUE ("eventId", "sessionId")`);
    console.log("  ✓ Unique constraint added");
  } catch (e) {
    console.log("  ⚠ Unique constraint:", e.message);
  }

  try {
    await runSQL(`ALTER TABLE "Rsvp" ADD CONSTRAINT "Rsvp_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    console.log("  ✓ Foreign key added");
  } catch (e) {
    console.log("  ⚠ Foreign key:", e.message);
  }

  console.log("\nMigration done!");
}

main().catch(console.error);
