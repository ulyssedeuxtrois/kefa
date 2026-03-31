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
  {
    title: "Soirée karaoké au O'Sullivan",
    description:
      "Viens chanter tes tubes préférés dans une ambiance conviviale ! Bières artisanales et cocktails disponibles au bar. Micro ouvert à tous les niveaux, du débutant timide au chanteur confirmé.",
    categorySlug: "musique-soirees",
    location: "O'Sullivan Pub",
    address: "1 boulevard Montmartre, 75002 Paris",
    lat: 48.8716,
    lng: 2.3424,
    price: 0,
    isFree: true,
    daysFromNow: 2,
  },
  {
    title: "Vide-greniers du quartier Bastille",
    description:
      "Le grand vide-greniers annuel du quartier Bastille revient ! Plus de 100 exposants, brocante, vêtements vintage, vinyles, jouets, livres... Ambiance familiale garantie avec animation musicale.",
    categorySlug: "vie-locale",
    location: "Place de la Bastille",
    address: "Place de la Bastille, 75004 Paris",
    lat: 48.8533,
    lng: 2.3692,
    price: 0,
    isFree: true,
    daysFromNow: 5,
  },
  {
    title: "Atelier dégustation de vins naturels",
    description:
      "Découvre l'univers des vins naturels avec notre sommelier passionné. 6 vins à déguster, accompagnés de fromages et charcuterie. Places limitées à 15 personnes.",
    categorySlug: "food-degustations",
    location: "Cave Le Petit Cru",
    address: "18 rue Oberkampf, 75011 Paris",
    lat: 48.8648,
    lng: 2.3784,
    price: 35,
    isFree: false,
    daysFromNow: 3,
  },
  {
    title: "Concert jazz — Trio Magnolia",
    description:
      "Le Trio Magnolia revient avec un set de jazz contemporain mêlant standards revisités et compositions originales. Contrebasse, piano, batterie. Réservation conseillée.",
    categorySlug: "musique-soirees",
    location: "Le Sunset Jazz Club",
    address: "60 rue des Lombards, 75001 Paris",
    lat: 48.8597,
    lng: 2.3487,
    price: 15,
    isFree: false,
    daysFromNow: 7,
  },
  {
    title: "Tournoi Super Smash Bros Ultimate",
    description:
      "Tournoi ouvert à tous ! Format double élimination, 32 joueurs max. Ramenez vos manettes. Lots à gagner pour le top 3. Buvette sur place.",
    categorySlug: "jeux-geek",
    location: "Gaming Zone Paris",
    address: "42 rue de Rivoli, 75004 Paris",
    lat: 48.8557,
    lng: 2.3537,
    price: 5,
    isFree: false,
    daysFromNow: 4,
  },
  {
    title: "Yoga au lever du soleil — Parc des Buttes-Chaumont",
    description:
      "Session de yoga Vinyasa en plein air, ouverte à tous niveaux. Apportez votre tapis. La séance dure 1h15 et se termine par une méditation guidée avec vue sur le lac.",
    categorySlug: "sport-bien-etre",
    location: "Parc des Buttes-Chaumont",
    address: "1 rue Botzaris, 75019 Paris",
    lat: 48.8809,
    lng: 2.3826,
    price: 0,
    isFree: true,
    daysFromNow: 1,
  },
  {
    title: "Exposition — Street Art parisien",
    description:
      "Une exposition immersive qui retrace 30 ans de street art à Paris. Œuvres de Jef Aérosol, C215, Invader et des artistes émergents. Entrée libre.",
    categorySlug: "culture-expositions",
    location: "Galerie Itinérance",
    address: "24 boulevard du Général d'Armée Jean Simon, 75013 Paris",
    lat: 48.8322,
    lng: 2.3628,
    price: 0,
    isFree: true,
    daysFromNow: 10,
  },
  {
    title: "Conférence — L'IA dans la musique",
    description:
      "Comment l'intelligence artificielle transforme la création musicale ? Intervenants : chercheurs de l'IRCAM, producteurs, et artistes. Suivi d'un débat ouvert.",
    categorySlug: "conferences-savoirs",
    location: "Station F",
    address: "5 parvis Alan Turing, 75013 Paris",
    lat: 48.8348,
    lng: 2.3699,
    price: 0,
    isFree: true,
    daysFromNow: 6,
  },
  {
    title: "Marché de producteurs bio",
    description:
      "Fruits, légumes, fromages, miel, pain au levain... Tous les jeudis, retrouve les producteurs locaux d'Île-de-France. Possibilité de commander des paniers.",
    categorySlug: "vie-locale",
    location: "Place du Marché Sainte-Catherine",
    address: "Place du Marché Sainte-Catherine, 75004 Paris",
    lat: 48.854,
    lng: 2.3618,
    price: 0,
    isFree: true,
    daysFromNow: 0,
  },
  {
    title: "Atelier peinture pour enfants",
    description:
      "Atelier créatif pour les 5-12 ans ! Les enfants réalisent une fresque collective sous la guidance d'une artiste plasticienne. Tout le matériel est fourni.",
    categorySlug: "famille-enfants",
    location: "Centre culturel Le 104",
    address: "5 rue Curial, 75019 Paris",
    lat: 48.8908,
    lng: 2.3706,
    price: 8,
    isFree: false,
    daysFromNow: 8,
  },
  {
    title: "Soirée networking tech & startups",
    description:
      "Rencontre des founders, devs et designers de l'écosystème startup parisien. Pitch de 3 startups early-stage, puis networking libre autour d'un verre.",
    categorySlug: "business-networking",
    location: "WeWork La Fayette",
    address: "92 avenue des Champs-Élysées, 75008 Paris",
    lat: 48.8714,
    lng: 2.3048,
    price: 0,
    isFree: true,
    daysFromNow: 9,
  },
  {
    title: "Randonnée urbaine — Paris insolite",
    description:
      "Découvre les passages secrets, cours cachées et architectures méconnues de Paris avec un guide passionné. Parcours de 6km, accessible à tous.",
    categorySlug: "nature-decouvertes",
    location: "Métro Arts et Métiers",
    address: "Sortie 1 Métro Arts et Métiers, 75003 Paris",
    lat: 48.8653,
    lng: 2.3562,
    price: 12,
    isFree: false,
    daysFromNow: 11,
  },
];

async function main() {
  console.log("🌱 Seeding database...\n");

  // Create categories
  console.log("📂 Creating categories...");
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

  // Create demo users
  console.log("\n👤 Creating demo users...");
  const organizer = await prisma.user.upsert({
    where: { email: "orga@kefa.app" },
    update: {},
    create: {
      email: "orga@kefa.app",
      name: "Marie Dupont",
      password: hashPassword("password123"),
      role: "ORGANIZER",
    },
  });
  console.log(`  ✓ Organizer: ${organizer.email}`);

  const admin = await prisma.user.upsert({
    where: { email: "admin@kefa.app" },
    update: {},
    create: {
      email: "admin@kefa.app",
      name: "Admin Kefa",
      password: hashPassword("admin123"),
      role: "ADMIN",
    },
  });
  console.log(`  ✓ Admin: ${admin.email}`);

  const user = await prisma.user.upsert({
    where: { email: "user@kefa.app" },
    update: {},
    create: {
      email: "user@kefa.app",
      name: "Lucas Martin",
      password: hashPassword("password123"),
      role: "USER",
    },
  });
  console.log(`  ✓ User: ${user.email}`);

  // Create sample events
  console.log("\n📅 Creating sample events...");
  const now = new Date();

  for (const eventData of sampleEvents) {
    const eventDate = new Date(now);
    eventDate.setDate(eventDate.getDate() + eventData.daysFromNow);
    eventDate.setHours(19, 0, 0, 0);

    const endDate = new Date(eventDate);
    endDate.setHours(22, 0, 0, 0);

    await prisma.event.create({
      data: {
        title: eventData.title,
        description: eventData.description,
        date: eventDate,
        endDate: endDate,
        location: eventData.location,
        address: eventData.address,
        lat: eventData.lat,
        lng: eventData.lng,
        price: eventData.price,
        isFree: eventData.isFree,
        status: "APPROVED",
        categoryId: categoryMap[eventData.categorySlug],
        organizerId: organizer.id,
      },
    });
    console.log(`  ✓ ${eventData.title}`);
  }

  console.log("\n✅ Seed completed!");
  console.log("\n📋 Demo accounts:");
  console.log("  User:       user@kefa.app / password123");
  console.log("  Organizer:  orga@kefa.app / password123");
  console.log("  Admin:      admin@kefa.app / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
