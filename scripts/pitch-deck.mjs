import PptxGenJS from "pptxgenjs";

const pptx = new PptxGenJS();

// Theme colors
const PRIMARY = "FF5A36";
const DARK = "1A1A2E";
const GRAY = "6B7280";
const LIGHT_BG = "FFF8F6";
const WHITE = "FFFFFF";

// Font
pptx.layout = "LAYOUT_16x9";

// ─── Helpers ───────────────────────────────────────────────────────────────

function addSlide({ bg = WHITE } = {}) {
  const slide = pptx.addSlide();
  slide.background = { color: bg };
  return slide;
}

function title(slide, text, opts = {}) {
  slide.addText(text, {
    x: opts.x ?? 0.6,
    y: opts.y ?? 0.4,
    w: opts.w ?? 8.8,
    h: opts.h ?? 0.8,
    fontSize: opts.size ?? 36,
    bold: true,
    color: opts.color ?? DARK,
    fontFace: "Calibri",
    ...opts,
  });
}

function sub(slide, text, opts = {}) {
  slide.addText(text, {
    x: opts.x ?? 0.6,
    y: opts.y ?? 1.3,
    w: opts.w ?? 8.8,
    h: opts.h ?? 0.5,
    fontSize: opts.size ?? 16,
    color: opts.color ?? GRAY,
    fontFace: "Calibri",
    ...opts,
  });
}

function label(slide, text, x, y, opts = {}) {
  slide.addText(text, {
    x, y,
    w: opts.w ?? 3.5,
    h: opts.h ?? 0.4,
    fontSize: opts.size ?? 13,
    color: opts.color ?? GRAY,
    fontFace: "Calibri",
    ...opts,
  });
}

function accent(slide, text, x, y, opts = {}) {
  slide.addText(text, {
    x, y,
    w: opts.w ?? 3.5,
    h: opts.h ?? 0.6,
    fontSize: opts.size ?? 22,
    bold: true,
    color: opts.color ?? PRIMARY,
    fontFace: "Calibri",
    ...opts,
  });
}

function pill(slide, text, x, y, opts = {}) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y,
    w: opts.w ?? 2.4,
    h: opts.h ?? 0.55,
    fill: { color: opts.fill ?? "FFF0EC" },
    line: { color: PRIMARY, width: 1 },
    rectRadius: 0.15,
  });
  slide.addText(text, {
    x: x + 0.1,
    y: y + 0.05,
    w: (opts.w ?? 2.4) - 0.2,
    h: 0.45,
    fontSize: opts.size ?? 13,
    bold: true,
    color: PRIMARY,
    align: "center",
    fontFace: "Calibri",
  });
}

function card(slide, title2, body, x, y, w = 2.6, h = 1.6, opts = {}) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h,
    fill: { color: opts.bg ?? LIGHT_BG },
    line: { color: "F3E8E4", width: 1 },
    rectRadius: 0.12,
  });
  slide.addText(title2, {
    x: x + 0.15, y: y + 0.12, w: w - 0.3, h: 0.4,
    fontSize: 14, bold: true, color: DARK, fontFace: "Calibri",
  });
  slide.addText(body, {
    x: x + 0.15, y: y + 0.55, w: w - 0.3, h: h - 0.75,
    fontSize: 11.5, color: GRAY, fontFace: "Calibri", breakLine: true,
  });
}

function divider(slide, y = 1.15) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.6, y,
    w: 0.5, h: 0.04,
    fill: { color: PRIMARY },
    line: { color: PRIMARY },
  });
}

// ─── Slide 1 — Titre ───────────────────────────────────────────────────────

{
  const s = addSlide({ bg: DARK });

  // Background gradient circle (decorative)
  s.addShape(pptx.ShapeType.ellipse, {
    x: 7.2, y: -1.2, w: 4.5, h: 4.5,
    fill: { type: "solid", color: "FF5A36", transparency: 75 },
    line: { color: "FF5A36", transparency: 75 },
  });

  s.addText("🎯", { x: 0.6, y: 0.5, w: 0.7, h: 0.7, fontSize: 30 });

  s.addText("Ziben", {
    x: 0.6, y: 1.2, w: 6, h: 1.1,
    fontSize: 60, bold: true, color: WHITE, fontFace: "Calibri",
  });

  s.addText("Ce soir, tu fais quoi ?", {
    x: 0.6, y: 2.3, w: 7, h: 0.7,
    fontSize: 26, color: "FFAA90", fontFace: "Calibri", italic: true,
  });

  s.addText("L'app qui regroupe tous les bons plans de ta ville\nen un seul endroit — et les pousse à toi.", {
    x: 0.6, y: 3.2, w: 7.5, h: 0.9,
    fontSize: 15, color: "CCCCCC", fontFace: "Calibri", breakLine: true,
  });

  s.addText("ziben.onrender.com", {
    x: 0.6, y: 4.5, w: 4, h: 0.4,
    fontSize: 13, color: PRIMARY, fontFace: "Calibri",
    hyperlink: { url: "https://ziben.onrender.com" },
  });
}

// ─── Slide 2 — Le problème ─────────────────────────────────────────────────

{
  const s = addSlide();
  divider(s);
  title(s, "Le problème");
  sub(s, "Trouver un event à Nice, c'est une galère.");

  const problems = [
    ["📱", "Infos éparpillées", "Facebook, Instagram, sites de salles,\naffiches dans la rue… rien de centralisé."],
    ["🔔", "Zéro notification", "Tu rates des events qui t'auraient plu\nparce que personne te le dit."],
    ["🗺️", "Pas de vue globale", "Impossible de voir en un coup d'œil\nce qui se passe près de chez toi ce soir."],
  ];

  problems.forEach(([emoji, ttl, body], i) => {
    const x = 0.6 + i * 3.05;
    s.addText(emoji, { x, y: 1.85, w: 0.6, h: 0.6, fontSize: 26 });
    s.addText(ttl, { x: x + 0.65, y: 1.9, w: 2.3, h: 0.45, fontSize: 15, bold: true, color: DARK, fontFace: "Calibri" });
    card(s, "", body, x, 2.55, 2.85, 1.5, { bg: "FFF0EC" });
  });

  s.addText("Résultat : des events qui font salle vide. Des gens qui s'ennuient chez eux. Une ville qui perd en vivacité.", {
    x: 0.6, y: 4.3, w: 8.8, h: 0.5,
    fontSize: 13, color: GRAY, italic: true, fontFace: "Calibri", align: "center",
  });
}

// ─── Slide 3 — La solution ─────────────────────────────────────────────────

{
  const s = addSlide();
  divider(s);
  title(s, "La solution");
  sub(s, "Un agrégateur d'events local, pensé mobile-first.");

  const features = [
    ["🗓️", "Explorer", "Tous les events de ta ville triés par date, catégorie, prix. Gratuit, payant, ce soir, ce week-end."],
    ["🗺️", "Carte interactive", "Vois en un coup d'œil ce qui se passe autour de toi avec les pins sur la carte."],
    ["🔔", "Alertes push", "Notifications web dès qu'un nouvel event est approuvé. Sans télécharger une app."],
    ["📲", "PWA installable", "S'installe sur l'écran d'accueil comme une app native. Fonctionne offline."],
  ];

  features.forEach(([emoji, ttl, body], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.6 + col * 4.6;
    const y = 1.9 + row * 1.6;
    card(s, `${emoji}  ${ttl}`, body, x, y, 4.3, 1.45);
  });
}

// ─── Slide 4 — Comment ça marche ───────────────────────────────────────────

{
  const s = addSlide({ bg: LIGHT_BG });
  divider(s);
  title(s, "Comment ça marche");

  const steps = [
    ["1", "Un organisateur\nsoumet un event", "Via le formulaire /submit\nou son espace organisateur"],
    ["2", "L'admin\nvalide en 1 clic", "Modération rapide\nsur le panel admin"],
    ["3", "L'event est\npublié + pushé", "Notification envoyée\nà tous les abonnés"],
    ["4", "Les utilisateurs\nexplorent & RSVP", "Filtres, carte,\nfavoris, partage"],
  ];

  steps.forEach(([num, ttl, body], i) => {
    const x = 0.4 + i * 2.4;

    // Number bubble
    s.addShape(pptx.ShapeType.ellipse, {
      x: x + 0.85, y: 1.45, w: 0.55, h: 0.55,
      fill: { color: PRIMARY }, line: { color: PRIMARY },
    });
    s.addText(num, {
      x: x + 0.85, y: 1.45, w: 0.55, h: 0.55,
      fontSize: 16, bold: true, color: WHITE, align: "center", valign: "middle", fontFace: "Calibri",
    });

    // Arrow (except last)
    if (i < 3) {
      s.addShape(pptx.ShapeType.rightArrow, {
        x: x + 2.15, y: 1.6, w: 0.35, h: 0.25,
        fill: { color: "DDDDDD" }, line: { color: "DDDDDD" },
      });
    }

    card(s, ttl, body, x, 2.15, 2.1, 1.8, { bg: WHITE });
  });
}

// ─── Slide 5 — Marché ──────────────────────────────────────────────────────

{
  const s = addSlide();
  divider(s);
  title(s, "Marché cible");
  sub(s, "On commence local. On scale en France.");

  // Timeline / funnel
  const markets = [
    { label: "Nice (Côte d'Azur)", size: "350 000 hab.", note: "MVP live aujourd'hui", color: PRIMARY, w: 7 },
    { label: "PACA", size: "5 millions hab.", note: "Phase 2 — Q3 2025", color: "FF8C6E", w: 5.5 },
    { label: "France entière", size: "67 millions hab.", note: "Phase 3", color: "FFB8A0", w: 4 },
  ];

  markets.forEach(({ label: lbl, size, note, color, w }, i) => {
    const y = 1.9 + i * 1.05;
    const x = (9.6 - w) / 2;
    s.addShape(pptx.ShapeType.roundRect, {
      x, y, w, h: 0.78,
      fill: { color }, line: { color },
      rectRadius: 0.12,
    });
    s.addText(`${lbl}  ·  ${size}`, {
      x: x + 0.2, y: y + 0.05, w: w - 2.5, h: 0.35,
      fontSize: 14, bold: true, color: WHITE, fontFace: "Calibri",
    });
    s.addText(note, {
      x: x + 0.2, y: y + 0.4, w: w - 2.5, h: 0.3,
      fontSize: 11, color: "FFE8E0", fontFace: "Calibri",
    });
    // TAM
    s.addText(size, {
      x: x + w - 2.4, y: y + 0.18, w: 2.2, h: 0.4,
      fontSize: 14, bold: true, color: WHITE, align: "right", fontFace: "Calibri",
    });
  });

  s.addText("Modèle duplicable : une ville = un instance. La même stack, 0 refonte.", {
    x: 0.6, y: 5.1, w: 8.8, h: 0.35,
    fontSize: 12, color: GRAY, italic: true, align: "center", fontFace: "Calibri",
  });
}

// ─── Slide 6 — Business model ──────────────────────────────────────────────

{
  const s = addSlide({ bg: DARK });

  s.addText("Business Model", {
    x: 0.6, y: 0.4, w: 8.8, h: 0.8,
    fontSize: 36, bold: true, color: WHITE, fontFace: "Calibri",
  });

  s.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.15, w: 0.5, h: 0.04, fill: { color: PRIMARY }, line: { color: PRIMARY } });

  const streams = [
    { icon: "🎁", title: "Freemium", price: "Gratuit", desc: "Soumettre 1 event\nest toujours gratuit.\nOn maximise la base de contenu." },
    { icon: "⭐", title: "Mise en avant", price: "5–20 €/event", desc: "Passer en tête de liste,\nbadge 'Coup de cœur',\nnotification dédiée." },
    { icon: "📦", title: "Abonnement Orga", price: "29–79 €/mois", desc: "Dashboard analytics,\nevents illimités,\npush automatiques." },
    { icon: "🤝", title: "Partenariats locaux", price: "Sur devis", desc: "Bannières géolocalisées,\nsponsoring de catégorie,\npack visibilité annuel." },
  ];

  streams.forEach(({ icon, title: t, price, desc }, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.6 + col * 4.6;
    const y = 1.6 + row * 1.85;

    s.addShape(pptx.ShapeType.roundRect, {
      x, y, w: 4.2, h: 1.7,
      fill: { color: "2A2A3E" }, line: { color: "3A3A5E" },
      rectRadius: 0.12,
    });
    s.addText(`${icon}  ${t}`, { x: x + 0.15, y: y + 0.1, w: 2.5, h: 0.4, fontSize: 14, bold: true, color: WHITE, fontFace: "Calibri" });
    s.addText(price, { x: x + 2.7, y: y + 0.1, w: 1.35, h: 0.4, fontSize: 13, bold: true, color: PRIMARY, align: "right", fontFace: "Calibri" });
    s.addText(desc, { x: x + 0.15, y: y + 0.55, w: 3.9, h: 1.0, fontSize: 11, color: "AAAAAA", fontFace: "Calibri", breakLine: true });
  });
}

// ─── Slide 7 — Traction ────────────────────────────────────────────────────

{
  const s = addSlide();
  divider(s);
  title(s, "Traction");
  sub(s, "MVP live — construit en quelques semaines.");

  const metrics = [
    ["19", "Events actifs\nsur Nice"],
    ["3", "Comptes utilisateurs\ndemo actifs"],
    ["PWA", "Installable sur\niOS & Android"],
    ["100%", "Pages indexées\nGoogle (sitemap live)"],
  ];

  metrics.forEach(([val, lbl], i) => {
    const x = 0.5 + i * 2.35;
    s.addShape(pptx.ShapeType.roundRect, {
      x, y: 1.75, w: 2.15, h: 1.5,
      fill: { color: "FFF0EC" }, line: { color: "FFD0C0" },
      rectRadius: 0.12,
    });
    s.addText(val, { x, y: 1.85, w: 2.15, h: 0.7, fontSize: 34, bold: true, color: PRIMARY, align: "center", fontFace: "Calibri" });
    s.addText(lbl, { x, y: 2.6, w: 2.15, h: 0.55, fontSize: 11, color: GRAY, align: "center", fontFace: "Calibri", breakLine: true });
  });

  s.addText("✅ Ce qui est live", {
    x: 0.6, y: 3.45, w: 4, h: 0.4,
    fontSize: 14, bold: true, color: DARK, fontFace: "Calibri",
  });

  const done = [
    "Explore, Carte, /submit, RSVP, Favoris",
    "Panel admin (approbation, gestion users)",
    "Push notifications web (VAPID)",
    "SEO : sitemap, robots, Open Graph, JSON-LD",
    "PWA installable (manifest, service worker)",
    "App Android TWA signée (APK prêt)",
  ];

  done.forEach((item, i) => {
    s.addText(`✓  ${item}`, {
      x: 0.6, y: 3.95 + i * 0.28, w: 4.2, h: 0.28,
      fontSize: 11.5, color: DARK, fontFace: "Calibri",
    });
  });

  s.addText("🚧 Prochaines étapes", {
    x: 5.2, y: 3.45, w: 4, h: 0.4,
    fontSize: 14, bold: true, color: DARK, fontFace: "Calibri",
  });

  const next = [
    "Domaine ziben.fr + HTTPS custom",
    "Scraping events réels Nice",
    "Onboarding premiers organisateurs",
    "Dashboard analytics organisateur",
    "Système de paiement (Stripe)",
    "Expansion PACA (Marseille, Toulon…)",
  ];

  next.forEach((item, i) => {
    s.addText(`→  ${item}`, {
      x: 5.2, y: 3.95 + i * 0.28, w: 4.2, h: 0.28,
      fontSize: 11.5, color: GRAY, fontFace: "Calibri",
    });
  });
}

// ─── Slide 8 — Stack technique ─────────────────────────────────────────────

{
  const s = addSlide({ bg: LIGHT_BG });
  divider(s);
  title(s, "Stack technique");
  sub(s, "Moderne, scalable, low-cost.");

  const techs = [
    { cat: "Frontend", items: ["Next.js 14 (App Router)", "TypeScript", "Tailwind CSS", "PWA / Service Worker"] },
    { cat: "Backend / API", items: ["Next.js API Routes", "Prisma ORM", "PostgreSQL (Neon)", "JWT / cookies httpOnly"] },
    { cat: "Infrastructure", items: ["Render.com (déploiement auto)", "Neon (DB serverless)", "VAPID push notifications", "GitHub CI/CD"] },
    { cat: "Mobile", items: ["TWA (Trusted Web Activity)", "APK Android signé", "Manifest PWA iOS"] },
  ];

  techs.forEach(({ cat, items }, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.5 + col * 4.65;
    const y = 1.75 + row * 1.75;

    s.addShape(pptx.ShapeType.roundRect, {
      x, y, w: 4.3, h: 1.6,
      fill: { color: WHITE }, line: { color: "F3E8E4" },
      rectRadius: 0.1,
    });
    s.addText(cat, { x: x + 0.15, y: y + 0.1, w: 4, h: 0.35, fontSize: 13, bold: true, color: PRIMARY, fontFace: "Calibri" });
    items.forEach((item, j) => {
      s.addText(`·  ${item}`, {
        x: x + 0.15, y: y + 0.5 + j * 0.26, w: 3.9, h: 0.26,
        fontSize: 11.5, color: DARK, fontFace: "Calibri",
      });
    });
  });
}

// ─── Slide 9 — Équipe ──────────────────────────────────────────────────────

{
  const s = addSlide();
  divider(s);
  title(s, "Équipe");
  sub(s, "Un seul fondateur full-stack pour l'instant — et c'est volontaire.");

  // Founder card
  s.addShape(pptx.ShapeType.ellipse, {
    x: 3.9, y: 1.6, w: 1.8, h: 1.8,
    fill: { color: "FFF0EC" }, line: { color: PRIMARY, width: 2 },
  });
  s.addText("🧑‍💻", { x: 3.9, y: 1.7, w: 1.8, h: 1.6, fontSize: 40, align: "center" });

  s.addText("Ulysse", {
    x: 2, y: 3.6, w: 5.6, h: 0.6,
    fontSize: 24, bold: true, color: DARK, align: "center", fontFace: "Calibri",
  });
  s.addText("Fondateur & Développeur full-stack", {
    x: 2, y: 4.2, w: 5.6, h: 0.4,
    fontSize: 14, color: GRAY, align: "center", fontFace: "Calibri",
  });

  const skills = ["Next.js / React", "Node.js / Prisma", "Product Design", "DevOps / Déploiement"];
  skills.forEach((sk, i) => {
    pill(s, sk, 1.2 + i * 2.1, 4.8, { w: 1.9 });
  });

  s.addText("Recherche : co-fondateur growth/business, premier investisseur, partenaires locaux.", {
    x: 0.6, y: 5.5, w: 8.8, h: 0.35,
    fontSize: 12, color: GRAY, italic: true, align: "center", fontFace: "Calibri",
  });
}

// ─── Slide 10 — Appel à l'action ───────────────────────────────────────────

{
  const s = addSlide({ bg: DARK });

  s.addShape(pptx.ShapeType.ellipse, {
    x: -1, y: 3, w: 5, h: 5,
    fill: { color: PRIMARY, transparency: 80 },
    line: { color: PRIMARY, transparency: 80 },
  });
  s.addShape(pptx.ShapeType.ellipse, {
    x: 7, y: -1.5, w: 4, h: 4,
    fill: { color: "FF8C6E", transparency: 80 },
    line: { color: "FF8C6E", transparency: 80 },
  });

  s.addText("On construit la référence\ndes events locaux en France.", {
    x: 0.6, y: 0.5, w: 8.8, h: 1.8,
    fontSize: 34, bold: true, color: WHITE, fontFace: "Calibri", breakLine: true, align: "center",
  });

  s.addText("Tu veux être dans l'aventure ?", {
    x: 0.6, y: 2.4, w: 8.8, h: 0.6,
    fontSize: 20, color: "FFAA90", fontFace: "Calibri", italic: true, align: "center",
  });

  const ctas = [
    ["💼", "Investisseur / BA", "Seed round ouvert"],
    ["🤝", "Partenaire local", "Co-branding Nice"],
    ["🎪", "Organisateur", "Liste d'attente ouverte"],
  ];

  ctas.forEach(([icon, ttl, note], i) => {
    const x = 1.1 + i * 2.85;
    s.addShape(pptx.ShapeType.roundRect, {
      x, y: 3.2, w: 2.5, h: 1.4,
      fill: { color: "2A2A3E" }, line: { color: "3A3A5E" },
      rectRadius: 0.12,
    });
    s.addText(icon, { x, y: 3.3, w: 2.5, h: 0.45, fontSize: 22, align: "center" });
    s.addText(ttl, { x, y: 3.8, w: 2.5, h: 0.35, fontSize: 12, bold: true, color: WHITE, align: "center", fontFace: "Calibri" });
    s.addText(note, { x, y: 4.15, w: 2.5, h: 0.3, fontSize: 10, color: "AAAAAA", align: "center", fontFace: "Calibri" });
  });

  s.addText("🌐  ziben.onrender.com", {
    x: 0.6, y: 4.85, w: 4, h: 0.4,
    fontSize: 13, color: PRIMARY, fontFace: "Calibri",
  });
  s.addText("✉️  contact@ziben.fr", {
    x: 5, y: 4.85, w: 4, h: 0.4,
    fontSize: 13, color: PRIMARY, fontFace: "Calibri", align: "right",
  });
}

// ─── Export ────────────────────────────────────────────────────────────────

await pptx.writeFile({ fileName: "ziben-pitch-deck.pptx" });
console.log("✓ ziben-pitch-deck.pptx généré !");
