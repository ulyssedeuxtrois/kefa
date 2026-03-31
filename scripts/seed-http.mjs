// Seed database via Neon HTTP SQL API
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
  console.log("Seeding categories...");
  await runSQL(`INSERT INTO "Category" ("id", "name", "slug", "icon") VALUES
    ('cat1', 'Musique & soirées', 'musique-soirees', '🎵'),
    ('cat2', 'Arts & spectacles', 'arts-spectacles', '🎭'),
    ('cat3', 'Culture & expositions', 'culture-expositions', '🖼️'),
    ('cat4', 'Conférences & savoirs', 'conferences-savoirs', '🎤'),
    ('cat5', 'Vie locale', 'vie-locale', '🏘️'),
    ('cat6', 'Sport & bien-être', 'sport-bien-etre', '⚽'),
    ('cat7', 'Food & dégustations', 'food-degustations', '🍷'),
    ('cat8', 'Famille & enfants', 'famille-enfants', '👨‍👩‍👧‍👦'),
    ('cat9', 'Nature & découvertes', 'nature-decouvertes', '🌿'),
    ('cat10', 'Jeux & geek', 'jeux-geek', '🎮'),
    ('cat11', 'Business & networking', 'business-networking', '💼'),
    ('cat12', 'Événements saisonniers', 'evenements-saisonniers', '🎄')
    ON CONFLICT DO NOTHING`);
  console.log("  ✓ 12 categories");

  console.log("Seeding users...");
  await runSQL(`INSERT INTO "User" ("id", "email", "name", "password", "role", "updatedAt") VALUES
    ('user1', 'orga@kefa.app', 'Marie Dupont', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'ORGANIZER', NOW()),
    ('user2', 'admin@kefa.app', 'Admin Kefa', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'ADMIN', NOW()),
    ('user3', 'user@kefa.app', 'Lucas Martin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'USER', NOW())
    ON CONFLICT DO NOTHING`);
  console.log("  ✓ 3 users");

  console.log("Seeding events...");
  const events = [
    ["ev1", "Soirée karaoké au O'Sullivan", "Viens chanter tes tubes préférés !", 2, "O'Sullivan Pub", "1 boulevard Montmartre, 75002 Paris", 48.8716, 2.3424, 0, true, "cat1"],
    ["ev2", "Vide-greniers du quartier Bastille", "Le grand vide-greniers annuel !", 5, "Place de la Bastille", "Place de la Bastille, 75004 Paris", 48.8533, 2.3692, 0, true, "cat5"],
    ["ev3", "Atelier dégustation de vins naturels", "Découvre l'univers des vins naturels.", 3, "Cave Le Petit Cru", "18 rue Oberkampf, 75011 Paris", 48.8648, 2.3784, 35, false, "cat7"],
    ["ev4", "Concert jazz — Trio Magnolia", "Jazz contemporain, standards revisités.", 7, "Le Sunset Jazz Club", "60 rue des Lombards, 75001 Paris", 48.8597, 2.3487, 15, false, "cat1"],
    ["ev5", "Tournoi Super Smash Bros Ultimate", "Tournoi ouvert à tous !", 4, "Gaming Zone Paris", "42 rue de Rivoli, 75004 Paris", 48.8557, 2.3537, 5, false, "cat10"],
    ["ev6", "Yoga au lever du soleil", "Yoga Vinyasa en plein air.", 1, "Parc des Buttes-Chaumont", "1 rue Botzaris, 75019 Paris", 48.8809, 2.3826, 0, true, "cat6"],
    ["ev7", "Exposition — Street Art parisien", "30 ans de street art à Paris.", 10, "Galerie Itinérance", "24 bd du Général Jean Simon, 75013 Paris", 48.8322, 2.3628, 0, true, "cat3"],
    ["ev8", "Conférence — L'IA dans la musique", "L'IA transforme la création musicale.", 6, "Station F", "5 parvis Alan Turing, 75013 Paris", 48.8348, 2.3699, 0, true, "cat4"],
    ["ev9", "Marché de producteurs bio", "Fruits, légumes, fromages, miel...", 0, "Place du Marché Sainte-Catherine", "Place du Marché Sainte-Catherine, 75004 Paris", 48.854, 2.3618, 0, true, "cat5"],
    ["ev10", "Atelier peinture pour enfants", "Atelier créatif pour les 5-12 ans !", 8, "Centre culturel Le 104", "5 rue Curial, 75019 Paris", 48.8908, 2.3706, 8, false, "cat8"],
    ["ev11", "Soirée networking tech & startups", "Rencontre founders, devs et designers.", 9, "WeWork La Fayette", "92 avenue des Champs-Élysées, 75008 Paris", 48.8714, 2.3048, 0, true, "cat11"],
    ["ev12", "Randonnée urbaine — Paris insolite", "Passages secrets et architectures méconnues.", 11, "Métro Arts et Métiers", "Sortie 1 Métro Arts et Métiers, 75003 Paris", 48.8653, 2.3562, 12, false, "cat9"],
  ];

  for (const [id, title, desc, days, loc, addr, lat, lng, price, isFree, catId] of events) {
    const t = title.replace(/'/g, "''");
    const d = desc.replace(/'/g, "''");
    const l = loc.replace(/'/g, "''");
    await runSQL(`INSERT INTO "Event" ("id", "title", "description", "date", "endDate", "location", "address", "lat", "lng", "price", "isFree", "status", "categoryId", "organizerId", "updatedAt")
      VALUES ('${id}', '${t}', '${d}', NOW() + INTERVAL '${days} days', NOW() + INTERVAL '${days} days 3 hours', '${l}', '${addr}', ${lat}, ${lng}, ${price}, ${isFree}, 'APPROVED', '${catId}', 'user1', NOW())
      ON CONFLICT DO NOTHING`);
    console.log(`  ✓ ${title}`);
  }

  // Verify
  const cats = await runSQL('SELECT count(*) as c FROM "Category"');
  const users = await runSQL('SELECT count(*) as c FROM "User"');
  const evts = await runSQL('SELECT count(*) as c FROM "Event"');
  console.log(`\nDone! ${cats.rows[0].c} categories, ${users.rows[0].c} users, ${evts.rows[0].c} events`);
}

main().catch(console.error);
