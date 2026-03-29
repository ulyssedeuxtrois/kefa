// Script to push schema and seed production database
// Run with: npx tsx scripts/setup-prod-db.ts

import { PrismaClient } from "@prisma/client";
import { createHash } from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  return createHash("sha256")
    .update(password + (process.env.NEXTAUTH_SECRET || "dev-secret"))
    .digest("hex");
}

const categories = [
  { name: "Musique & soirées", slug: "musique-soirees", icon: "🎵" },
  { name: "Arts & spectacles", slug: "arts-spectacles", icon: "🎭" },
  { name: "Culture & expositions", slug: "culture-expositions", icon: "🖼️" },
  { name: "Conférences & savoirs", slug: "conferences-savoirs", icon: "🎤" },
  { name: "Vie locale", slug: "vie-locale", icon: "🏘️" },
  { name: "Sport & bien-être", slug: "sport-bien-etre", icon: "⚽" },
  { name: "Food & dégustations", slug: "food-degustations", icon: "🍷" },
  { name: "Famille & enfants", slug: "famille-enfants", icon: "👨‍👩‍👧‍👦" },
  { name: "Nature & découvertes", slug: "nature-decouvertes", icon: "🌿" },
  { name: "Jeux & geek", slug: "jeux-geek", icon: "🎮" },
  { name: "Business & networking", slug: "business-networking", icon: "💼" },
  { name: "Événements saisonniers", slug: "evenements-saisonniers", icon: "🎄" },
];

const sampleEvents = [
  { title: "Soirée karaoké au O'Sullivan", description: "Viens chanter tes tubes préférés dans une ambiance conviviale ! Bières artisanales et cocktails disponibles au bar.", categorySlug: "musique-soirees", location: "O'Sullivan Pub", address: "1 boulevard Montmartre, 75002 Paris", lat: 48.8716, lng: 2.3424, price: 0, isFree: true, daysFromNow: 2 },
  { title: "Vide-greniers du quartier Bastille", description: "Le grand vide-greniers annuel du quartier Bastille ! Plus de 100 exposants, brocante, vêtements vintage, vinyles, jouets.", categorySlug: "vie-locale", location: "Place de la Bastille", address: "Place de la Bastille, 75004 Paris", lat: 48.8533, lng: 2.3692, price: 0, isFree: true, daysFromNow: 5 },
  { title: "Atelier dégustation de vins naturels", description: "Découvre l'univers des vins naturels avec notre sommelier. 6 vins à déguster, accompagnés de fromages et charcuterie.", categorySlug: "food-degustations", location: "Cave Le Petit Cru", address: "18 rue Oberkampf, 75011 Paris", lat: 48.8648, lng: 2.3784, price: 35, isFree: false, daysFromNow: 3 },
  { title: "Concert jazz — Trio Magnolia", description: "Jazz contemporain mêlant standards revisités et compositions originales. Contrebasse, piano, batterie.", categorySlug: "musique-soirees", location: "Le Sunset Jazz Club", address: "60 rue des Lombards, 75001 Paris", lat: 48.8597, lng: 2.3487, price: 15, isFree: false, daysFromNow: 7 },
  { title: "Tournoi Super Smash Bros Ultimate", description: "Tournoi ouvert à tous ! Format double élimination, 32 joueurs max. Ramenez vos manettes.", categorySlug: "jeux-geek", location: "Gaming Zone Paris", address: "42 rue de Rivoli, 75004 Paris", lat: 48.8557, lng: 2.3537, price: 5, isFree: false, daysFromNow: 4 },
  { title: "Yoga au lever du soleil", description: "Session de yoga Vinyasa en plein air, ouverte à tous niveaux. Apportez votre tapis.", categorySlug: "sport-bien-etre", location: "Parc des Buttes-Chaumont", address: "1 rue Botzaris, 75019 Paris", lat: 48.8809, lng: 2.3826, price: 0, isFree: true, daysFromNow: 1 },
  { title: "Exposition — Street Art parisien", description: "Une exposition immersive qui retrace 30 ans de street art à Paris. Entrée libre.", categorySlug: "culture-expositions", location: "Galerie Itinérance", address: "24 bd du Général Jean Simon, 75013 Paris", lat: 48.8322, lng: 2.3628, price: 0, isFree: true, daysFromNow: 10 },
  { title: "Conférence — L'IA dans la musique", description: "Comment l'IA transforme la création musicale ? Intervenants : chercheurs de l'IRCAM, producteurs, et artistes.", categorySlug: "conferences-savoirs", location: "Station F", address: "5 parvis Alan Turing, 75013 Paris", lat: 48.8348, lng: 2.3699, price: 0, isFree: true, daysFromNow: 6 },
  { title: "Marché de producteurs bio", description: "Fruits, légumes, fromages, miel, pain au levain... Producteurs locaux d'Île-de-France.", categorySlug: "vie-locale", location: "Place du Marché Sainte-Catherine", address: "Place du Marché Sainte-Catherine, 75004 Paris", lat: 48.854, lng: 2.3618, price: 0, isFree: true, daysFromNow: 0 },
  { title: "Atelier peinture pour enfants", description: "Atelier créatif pour les 5-12 ans ! Fresque collective sous la guidance d'une artiste plasticienne.", categorySlug: "famille-enfants", location: "Centre culturel Le 104", address: "5 rue Curial, 75019 Paris", lat: 48.8908, lng: 2.3706, price: 8, isFree: false, daysFromNow: 8 },
  { title: "Soirée networking tech & startups", description: "Rencontre des founders, devs et designers. Pitch de 3 startups early-stage, puis networking libre.", categorySlug: "business-networking", location: "WeWork La Fayette", address: "92 avenue des Champs-Élysées, 75008 Paris", lat: 48.8714, lng: 2.3048, price: 0, isFree: true, daysFromNow: 9 },
  { title: "Randonnée urbaine — Paris insolite", description: "Passages secrets, cours cachées et architectures méconnues de Paris. Parcours de 6km.", categorySlug: "nature-decouvertes", location: "Métro Arts et Métiers", address: "Sortie 1 Métro Arts et Métiers, 75003 Paris", lat: 48.8653, lng: 2.3562, price: 12, isFree: false, daysFromNow: 11 },
];

async function main() {
  console.log("🌱 Seeding production database...\n");

  const categoryMap: Record<string, string> = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryMap[cat.slug] = created.id;
    console.log(`  ✓ ${cat.icon} ${cat.name}`);
  }

  const organizer = await prisma.user.upsert({
    where: { email: "orga@ziben.fr" },
    update: {},
    create: { email: "orga@ziben.fr", name: "Marie Dupont", password: hashPassword("password123"), role: "ORGANIZER" },
  });

  await prisma.user.upsert({
    where: { email: "admin@ziben.fr" },
    update: {},
    create: { email: "admin@ziben.fr", name: "Admin Ziben", password: hashPassword("admin123"), role: "ADMIN" },
  });

  await prisma.user.upsert({
    where: { email: "user@ziben.fr" },
    update: {},
    create: { email: "user@ziben.fr", name: "Lucas Martin", password: hashPassword("password123"), role: "USER" },
  });

  const now = new Date();
  for (const e of sampleEvents) {
    const date = new Date(now);
    date.setDate(date.getDate() + e.daysFromNow);
    date.setHours(19, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(22, 0, 0, 0);

    await prisma.event.create({
      data: {
        title: e.title, description: e.description, date, endDate,
        location: e.location, address: e.address, lat: e.lat, lng: e.lng,
        price: e.price, isFree: e.isFree, status: "APPROVED",
        categoryId: categoryMap[e.categorySlug], organizerId: organizer.id,
      },
    });
    console.log(`  ✓ ${e.title}`);
  }

  console.log("\n✅ Production seed completed!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
