/**
 * seed-real.mjs
 * Seeds the DB with a mix of real + realistic Nice events.
 * Based on actual venues, real event formats, real April 2026 calendar.
 * Run: node scripts/seed-real.mjs
 */

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

function date(daysFromNow, hour, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function fixedDate(year, month, day, hour, minute = 0) {
  return new Date(year, month - 1, day, hour, minute).toISOString();
}

function sat() {
  const d = new Date(); const day = d.getDay();
  return day === 6 ? 0 : 6 - day;
}
function sun() {
  const d = new Date(); const day = d.getDay();
  return day === 0 ? 7 : 7 - day;
}

function esc(s) { return s.replace(/'/g, "''"); }

const events = [

  // ─── CE SOIR ────────────────────────────────────────────────────────────
  {
    id: "r-tonight-1",
    title: "Karaoké Night au Shapko",
    desc: "Soirée karaoké ouverte à tous. Micro ouvert dès 21h, ambiance garantie. On chante tout : chanson française, pop, rap, variété italienne. Boissons et tapas sur place.",
    date: date(0, 21, 0), end: date(0, 23, 59),
    location: "Le Shapko", address: "5 Rue de la Barillerie, 06300 Nice",
    lat: 43.6975, lng: 7.2783, price: 0, isFree: true, cat: "cat1", cap: null,
    rsvp: 13, views: 62,
  },
  {
    id: "r-tonight-2",
    title: "Open Mic Stand-Up — Le Comedia",
    desc: "Scène ouverte humour tous les lundis. 5 minutes par tête, inscriptions sur place à partir de 20h. Débutants bienvenus — le public est bienveillant, promis.",
    date: date(0, 20, 30), end: date(0, 23, 0),
    location: "Le Comedia", address: "2 Rue Smolett, 06300 Nice",
    lat: 43.6961, lng: 7.2693, price: 5, isFree: false, cat: "cat2", cap: null,
    rsvp: 6, views: 44,
  },
  {
    id: "r-tonight-3",
    title: "Quiz Night — L'Abri Côtier",
    desc: "Quiz général en équipes de 4 max. Musique, cinéma, culture générale, sport, actu. 3 tours, lots pour le podium. Arrivée avant 20h45 recommandée.",
    date: date(0, 21, 0), end: date(0, 23, 30),
    location: "L'Abri Côtier", address: "23 Rue Gubernatis, 06000 Nice",
    lat: 43.6993, lng: 7.2704, price: 0, isFree: true, cat: "cat10", cap: 80,
    rsvp: 4, views: 38,
  },

  // ─── DEMAIN ─────────────────────────────────────────────────────────────
  {
    id: "r-tomorrow-1",
    title: "Marché aux Fleurs — Cours Saleya",
    desc: "Le marché aux fleurs le plus célèbre de la Côte. Fleurs coupées, plantes, producteurs locaux, herbes aromatiques. Tous les matins sauf lundi, de 6h à 13h30.",
    date: date(1, 6, 0), end: date(1, 13, 30),
    location: "Cours Saleya", address: "Cours Saleya, 06300 Nice",
    lat: 43.6953, lng: 7.2753, price: 0, isFree: true, cat: "cat5", cap: null,
    rsvp: 8, views: 91,
  },
  {
    id: "r-tomorrow-2",
    title: "Yoga Sunset — Promenade des Anglais",
    desc: "Session yoga face à la mer au coucher du soleil. Apportez votre tapis. Tous niveaux — même les grands débutants. Animée par une prof certifiée Hatha & Vinyasa.",
    date: date(1, 18, 30), end: date(1, 19, 45),
    location: "Promenade des Anglais", address: "Promenade des Anglais devant le Méridien, 06000 Nice",
    lat: 43.6942, lng: 7.2566, price: 8, isFree: false, cat: "cat6", cap: 25,
    rsvp: 18, views: 74,
  },
  {
    id: "r-tomorrow-3",
    title: "Afterwork Rooftop — Hyatt Regency",
    desc: "DJ set house & disco sur le rooftop avec vue panoramique sur la Baie des Anges. Cocktails signature, dress code smart casual. Réservation conseillée pour les tables.",
    date: date(1, 19, 0), end: date(1, 23, 0),
    location: "Hyatt Regency Nice Palais de la Méditerranée", address: "13 Promenade des Anglais, 06000 Nice",
    lat: 43.6946, lng: 7.2604, price: 15, isFree: false, cat: "cat1", cap: 120,
    rsvp: 31, views: 88,
  },

  // ─── CETTE SEMAINE — RÉELS ───────────────────────────────────────────────
  {
    id: "r-tairo",
    title: "Taïro en concert — Palais Nikaïa",
    desc: "Taïro, figure majeure du reggae français, fête ses 25 ans de carrière avec une tournée anniversaire exceptionnelle. Un show complet, une setlist de légende, à ne pas manquer.",
    date: fixedDate(2026, 4, 3, 20, 0), end: fixedDate(2026, 4, 3, 23, 0),
    location: "Palais Nikaïa", address: "163 Route de Grenoble, 06200 Nice",
    lat: 43.7172, lng: 7.2339, price: 35, isFree: false, cat: "cat1", cap: 7000,
    rsvp: 240, views: 620,
  },
  {
    id: "r-stars80",
    title: "Stars 80 — Palais Nikaïa",
    desc: "La soirée ultime pour revivre les années 80. Les chanteurs emblématiques de la décennie sur scène, ensemble, pour une nuit de nostalgie et de fête.",
    date: fixedDate(2026, 4, 8, 20, 0), end: fixedDate(2026, 4, 8, 23, 30),
    location: "Palais Nikaïa", address: "163 Route de Grenoble, 06200 Nice",
    lat: 43.7172, lng: 7.2339, price: 42, isFree: false, cat: "cat1", cap: 7000,
    rsvp: 185, views: 490,
  },
  {
    id: "r-play-azur",
    title: "Play Azur Festival — Jeux Vidéo & Geek",
    desc: "Le festival geek de la Côte d'Azur. Jeux vidéo en accès libre, tournois, cosplay, stands créateurs, retrogaming, VR, meet & greet. 2 jours de paradis pour les gamers.",
    date: fixedDate(2026, 4, 25, 10, 0), end: fixedDate(2026, 4, 26, 20, 0),
    location: "Palais des Expositions Nice Acropolis", address: "1 Esplanade Kennedy, 06300 Nice",
    lat: 43.6985, lng: 7.2781, price: 18, isFree: false, cat: "cat10", cap: 5000,
    rsvp: 112, views: 380,
  },
  {
    id: "r-val-b",
    title: "Val B. — Spectacle Magie « Évasion »",
    desc: "L'illusionniste Val B. présente un show de close-up et grande illusion. Cartes, mentalism, évasion — une heure de stupéfaction garantie. Places limitées, réservation indispensable.",
    date: fixedDate(2026, 4, 24, 21, 0), end: fixedDate(2026, 4, 24, 22, 30),
    location: "Théâtre L'Alphabet", address: "14 Rue Vernier, 06000 Nice",
    lat: 43.7008, lng: 7.2674, price: 22, isFree: false, cat: "cat2", cap: 80,
    rsvp: 44, views: 130,
  },
  {
    id: "r-cougourdons",
    title: "Festin des Cougourdons — Arènes de Cimiez",
    desc: "Fête traditionnelle niçoise célébrant les courges sculptées (les cougourdons). Artisans, folklore, musique occitane, buvette avec produits du terroir. Entrée libre, toute la famille.",
    date: fixedDate(2026, 3, 29, 10, 0), end: fixedDate(2026, 3, 29, 18, 0),
    location: "Arènes de Cimiez", address: "Avenue des Arènes de Cimiez, 06000 Nice",
    lat: 43.7200, lng: 7.2754, price: 0, isFree: true, cat: "cat5", cap: null,
    rsvp: 28, views: 156,
  },

  // ─── CE WEEK-END ─────────────────────────────────────────────────────────
  {
    id: "r-weekend-1",
    title: "Vide-Grenier du Port de Nice",
    desc: "Grand vide-grenier avec 100+ exposants sur le quai. Vinyles, fringues vintage, déco, livres, jouets, bijoux. Entrée libre, parking port.",
    date: date(sat(), 7, 0), end: date(sat(), 17, 0),
    location: "Port de Nice", address: "Quai Lunel, 06300 Nice",
    lat: 43.6945, lng: 7.2840, price: 0, isFree: true, cat: "cat5", cap: null,
    rsvp: 22, views: 117,
  },
  {
    id: "r-weekend-2",
    title: "Atelier Poterie — L'Atelier Terre",
    desc: "Initiation au tour de potier. Repartez avec votre pièce cuite et émaillée ! Matériel fourni, tablier prêté. Petits groupes de 6 max pour un vrai suivi.",
    date: date(sat(), 14, 0), end: date(sat(), 16, 30),
    location: "L'Atelier Terre", address: "15 Rue Gioffredo, 06000 Nice",
    lat: 43.6990, lng: 7.2700, price: 35, isFree: false, cat: "cat3", cap: 6,
    rsvp: 5, views: 58,
  },
  {
    id: "r-weekend-3",
    title: "Concert Jazz Manouche — Le Jam",
    desc: "Trio jazz manouche : guitare, contrebasse, violon. Ambiance tamisée, bougies et bon vin naturel. Réservation conseillée — salle intimiste.",
    date: date(sat(), 20, 30), end: date(sat(), 23, 0),
    location: "Le Jam", address: "18 Rue de la Buffa, 06000 Nice",
    lat: 43.6936, lng: 7.2540, price: 12, isFree: false, cat: "cat1", cap: 55,
    rsvp: 37, views: 89,
  },
  {
    id: "r-weekend-4",
    title: "Brunch au Marché de la Libération",
    desc: "Visite guidée du marché avec dégustation : socca fraîche, pissaladière, farcis niçois, fromages de brebis, olives marinées, huile d'olive AOC. Chef local présent.",
    date: date(sun(), 10, 0), end: date(sun(), 12, 30),
    location: "Marché de la Libération", address: "Place du Général de Gaulle, 06300 Nice",
    lat: 43.7065, lng: 7.2680, price: 22, isFree: false, cat: "cat7", cap: 12,
    rsvp: 9, views: 72,
  },
  {
    id: "r-weekend-5",
    title: "Randonnée Guidée — Colline du Château",
    desc: "Rando matinale avec guide historien. Points de vue incroyables sur la baie et le Vieux Nice. Histoire de la ville, anecdotes, photos garanties. RDV tour Bellanda.",
    date: date(sun(), 8, 30), end: date(sun(), 11, 0),
    location: "Colline du Château", address: "Tour Bellanda, Montée du Château, 06300 Nice",
    lat: 43.6960, lng: 7.2820, price: 0, isFree: true, cat: "cat9", cap: null,
    rsvp: 14, views: 66,
  },

  // ─── CETTE SEMAINE ────────────────────────────────────────────────────────
  {
    id: "r-week-1",
    title: "Expo Photo « Nice la Nuit » — Galerie de la Marine",
    desc: "30 photographes locaux exposent leur regard sur Nice by night. Portraits de rues, monuments illuminés, promeneurs nocturnes. Entrée libre du mardi au dimanche.",
    date: date(2, 10, 0), end: date(9, 19, 0),
    location: "Galerie de la Marine", address: "59 Quai des États-Unis, 06300 Nice",
    lat: 43.6950, lng: 7.2775, price: 0, isFree: true, cat: "cat3", cap: null,
    rsvp: 11, views: 95,
  },
  {
    id: "r-week-2",
    title: "Tournoi de Pétanque — Place Arson",
    desc: "Tournoi doublette ouvert à tous les niveaux. Inscriptions à partir de 13h30, premier tir à 14h. Lots pour les 3 premiers. Buvette, saucisses grillées.",
    date: date(3, 14, 0), end: date(3, 19, 0),
    location: "Place Arson", address: "Place Arson, 06300 Nice",
    lat: 43.7020, lng: 7.2725, price: 3, isFree: false, cat: "cat6", cap: 32,
    rsvp: 20, views: 54,
  },
  {
    id: "r-week-3",
    title: "Atelier Cuisine Niçoise — Socca & Cie",
    desc: "Un chef cuisinier niçois vous apprend les recettes du terroir : socca, pissaladière, ratatouille et tarte tropézienne. Tout le monde mange à la fin !",
    date: date(4, 10, 0), end: date(4, 13, 0),
    location: "Les Distilleries Idéales", address: "24 Place du Palais de Justice, 06300 Nice",
    lat: 43.6958, lng: 7.2768, price: 45, isFree: false, cat: "cat7", cap: 10,
    rsvp: 8, views: 47,
  },
  {
    id: "r-week-4",
    title: "Ciné Plein Air — Le Grand Bleu",
    desc: "Projection du Grand Bleu sur la Coulée Verte. Apportez plaid et coussins. Pop-corn offert à l'entrée. Accès libre, sans réservation. Repli salle si pluie.",
    date: date(5, 21, 0), end: date(5, 23, 30),
    location: "Coulée Verte René Cassin", address: "Coulée Verte, 06000 Nice",
    lat: 43.7000, lng: 7.2630, price: 0, isFree: true, cat: "cat2", cap: 200,
    rsvp: 33, views: 103,
  },
  {
    id: "r-week-5",
    title: "Conférence — L'IA au quotidien",
    desc: "Comment l'intelligence artificielle change vraiment nos vies de tous les jours. Intervenants tech locaux, démos live, questions-réponses ouvertes. Entrée libre sur inscription.",
    date: date(4, 18, 30), end: date(4, 20, 30),
    location: "Bibliothèque Louis Nucéra", address: "2 Place Yves Klein, 06000 Nice",
    lat: 43.7010, lng: 7.2624, price: 0, isFree: true, cat: "cat4", cap: 80,
    rsvp: 42, views: 88,
  },
  {
    id: "r-week-6",
    title: "Friperie Éphémère — Espace Magnan",
    desc: "Pop-up friperie avec sélection triée : pièces vintage, streetwear, y2k, workwear chic. CB et cash. Vestiaire disponible. Tout à moins de 30 euros.",
    date: date(sat(), 10, 0), end: date(sat(), 18, 0),
    location: "Espace Magnan", address: "31 Rue Louis de Coppet, 06200 Nice",
    lat: 43.6925, lng: 7.2440, price: 0, isFree: true, cat: "cat5", cap: null,
    rsvp: 17, views: 76,
  },
  {
    id: "r-week-7",
    title: "Battle Freestyle Rap — La Trésorerie",
    desc: "Battle MC 1v1 : inscriptions à 19h, battles à 20h. Jury de 3 personnes indépendantes. Cash prize pour le gagnant, runner-up remporte un studio session.",
    date: date(sat(), 20, 0), end: date(sat(), 23, 30),
    location: "La Trésorerie", address: "1 Rue de la Trésorerie, 06300 Nice",
    lat: 43.6970, lng: 7.2735, price: 5, isFree: false, cat: "cat1", cap: 100,
    rsvp: 28, views: 91,
  },
  {
    id: "r-week-8",
    title: "Soirée Jeux de Société — Le Spot",
    desc: "Catan, Dixit, Azul, 7 Wonders, Wingspan, Codenames... Plus de 200 jeux disponibles. L'équipe explique les règles. Boissons offertes. Débutants ultra bienvenus.",
    date: date(3, 19, 0), end: date(3, 23, 0),
    location: "Le Spot Nice", address: "7 Rue Bonaparte, 06300 Nice",
    lat: 43.6985, lng: 7.2710, price: 0, isFree: true, cat: "cat10", cap: null,
    rsvp: 19, views: 62,
  },
  {
    id: "r-week-9",
    title: "Chasse au Trésor — Vieux Nice",
    desc: "Parcours d'énigmes dans les ruelles du Vieux Nice. Adapté dès 6 ans. Équipes de 2 à 5. Indices cachés sur les façades et dans les cours secrètes. Lots pour tous.",
    date: date(sun(), 14, 0), end: date(sun(), 16, 30),
    location: "Vieux Nice", address: "Place Rossetti, 06300 Nice",
    lat: 43.6965, lng: 7.2755, price: 10, isFree: false, cat: "cat8", cap: 50,
    rsvp: 16, views: 68,
  },
  {
    id: "r-week-10",
    title: "Marché des Créateurs — Place du Pin",
    desc: "Marché artisanal avec 30 créateurs locaux : céramique, bijoux fait-main, illustrations, textile, savons naturels, plantes. Entrée libre, toute la journée.",
    date: date(sun(), 9, 0), end: date(sun(), 17, 0),
    location: "Place du Pin", address: "Place du Pin, 06300 Nice",
    lat: 43.6980, lng: 7.2770, price: 0, isFree: true, cat: "cat5", cap: null,
    rsvp: 7, views: 53,
  },

  // ─── PLUS LOIN ───────────────────────────────────────────────────────────
  {
    id: "r-far-1",
    title: "Nuit des Musées — Nice",
    desc: "Une nuit par an, tous les musées de Nice ouvrent gratuitement leurs portes jusqu'à minuit. MAMAC, Musée Matisse, Musée d'Art Moderne... Programmation spéciale nocturne.",
    date: fixedDate(2026, 5, 16, 19, 0), end: fixedDate(2026, 5, 17, 0, 0),
    location: "Musées de Nice", address: "Place Yves Klein, 06000 Nice",
    lat: 43.7010, lng: 7.2624, price: 0, isFree: true, cat: "cat3", cap: null,
    rsvp: 55, views: 198,
  },
  {
    id: "r-far-2",
    title: "Triathlon Nice — Côte d'Azur",
    desc: "Natation en Méditerranée, vélo sur la Promenade, course à pied dans le Vieux Nice. Inscriptions ouvertes pour toutes les distances. Spectateurs bienvenus gratuitement.",
    date: fixedDate(2026, 5, 10, 7, 0), end: fixedDate(2026, 5, 10, 16, 0),
    location: "Promenade des Anglais", address: "Promenade des Anglais, 06000 Nice",
    lat: 43.6942, lng: 7.2566, price: 0, isFree: true, cat: "cat6", cap: null,
    rsvp: 62, views: 234,
  },
];

async function main() {
  console.log("🗑️  Suppression des anciens events...");
  await runSQL(`DELETE FROM "SavedEvent"`);
  await runSQL(`DELETE FROM "Rsvp"`);
  await runSQL(`DELETE FROM "Event"`);
  console.log("   ✓ Nettoyé\n");

  console.log("🌱 Insertion des events...\n");

  const orgId = "user1";
  let ok = 0, ko = 0;

  for (const e of events) {
    const q = `INSERT INTO "Event" (
      "id","title","description","date","endDate","location","address",
      "lat","lng","price","isFree","imageUrl","status","city","categoryId",
      "organizerId","capacity","rsvpCount","viewCount","clickCount",
      "submitterName","submitterEmail","createdAt","updatedAt"
    ) VALUES (
      '${e.id}',
      '${esc(e.title)}',
      '${esc(e.desc)}',
      '${e.date}',
      ${e.end ? `'${e.end}'` : "NULL"},
      '${esc(e.location)}',
      '${esc(e.address)}',
      ${e.lat}, ${e.lng},
      ${e.price}, ${e.isFree},
      NULL, 'APPROVED', 'nice',
      '${e.cat}', '${orgId}',
      ${e.cap ?? "NULL"},
      ${e.rsvp}, ${e.views},
      ${Math.floor(Math.random() * 20)},
      NULL, NULL, NOW(), NOW()
    ) ON CONFLICT ("id") DO UPDATE SET
      "title"=EXCLUDED."title","date"=EXCLUDED."date",
      "endDate"=EXCLUDED."endDate","status"='APPROVED',
      "rsvpCount"=EXCLUDED."rsvpCount","viewCount"=EXCLUDED."viewCount",
      "updatedAt"=NOW()`;

    try {
      await runSQL(q);
      console.log(`  ✅ ${e.title}`);
      ok++;
    } catch (err) {
      console.log(`  ❌ ${e.title}: ${err.message}`);
      ko++;
    }
  }

  console.log(`\n${"─".repeat(50)}`);
  console.log(`✅ ${ok} events insérés  |  ❌ ${ko} erreurs`);
  console.log(`📅 ${events.filter(e => e.rsvp > 50).length} events avec forte traction (50+ RSVP)`);
  console.log(`🆓 ${events.filter(e => e.isFree).length} gratuits  |  💶 ${events.filter(e => !e.isFree).length} payants`);
}

main().catch(console.error);
