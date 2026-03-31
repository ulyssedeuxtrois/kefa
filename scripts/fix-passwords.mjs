// Fix user passwords with the correct NEXTAUTH_SECRET used in production
// Usage: node scripts/fix-passwords.mjs

import { createHash } from 'crypto';

const NEON_URL = "https://ep-divine-violet-agjael6h-pooler.c-2.eu-central-1.aws.neon.tech/sql";
const CONN_STRING = "postgresql://neondb_owner:npg_TLVHWEwn1N0K@ep-divine-violet-agjael6h-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require";
const NEXTAUTH_SECRET = "JEEG07vEV7hjyl6A0TJeZVDP8T/sPlODbAZrfshC1+Y=";

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

function hashPassword(password) {
  return createHash("sha256")
    .update(password + NEXTAUTH_SECRET)
    .digest("hex");
}

const users = [
  { email: "user@kefa.app", password: "password123" },
  { email: "orga@kefa.app", password: "password123" },
  { email: "admin@kefa.app", password: "admin123" },
];

console.log("Fixing user passwords with production NEXTAUTH_SECRET...\n");

for (const u of users) {
  const hash = hashPassword(u.password);
  const q = `UPDATE "User" SET "password" = '${hash}' WHERE "email" = '${u.email}'`;
  try {
    const result = await runSQL(q);
    const count = result.rowCount ?? result.rows?.length ?? '?';
    console.log(`  ✓ ${u.email} (${count} row updated)`);
  } catch (e) {
    console.log(`  ✗ ${u.email}: ${e.message}`);
  }
}

console.log("\n✓ Done. Passwords updated with production secret.");
