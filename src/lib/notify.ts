/**
 * notify.ts — Webhook Discord pour alertes admin
 *
 * Env var : DISCORD_WEBHOOK_URL (optionnel — si absent, silence total)
 * Si pas de webhook configuré, les fonctions ne font rien.
 */

async function sendDiscord(payload: object) {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // silence — les notifications sont best-effort
  }
}

export async function notifyNewOrganizer(user: {
  id: string;
  email: string;
  name: string | null;
}) {
  await sendDiscord({
    embeds: [
      {
        title: "🎉 Nouvel organisateur",
        description: `Un organisateur vient de s'inscrire sur Ziben.`,
        color: 0x22c55e,
        fields: [
          { name: "Nom", value: user.name || "—", inline: true },
          { name: "Email", value: user.email, inline: true },
          { name: "ID", value: user.id, inline: false },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  });
}

export async function notifyNewEvent(event: {
  id: string;
  title: string;
  date: Date;
  submitterName?: string | null;
  submitterEmail?: string | null;
  organizerEmail?: string | null;
  source?: "organizer" | "public" | "scraper";
}) {
  const who =
    event.submitterName ||
    event.submitterEmail ||
    event.organizerEmail ||
    "Anonyme";

  const emoji =
    event.source === "scraper"
      ? "🤖"
      : event.source === "organizer"
      ? "🏢"
      : "📝";

  await sendDiscord({
    embeds: [
      {
        title: `${emoji} Nouvel event soumis`,
        description: `**${event.title}**`,
        color: event.source === "scraper" ? 0x6366f1 : 0xf59e0b,
        fields: [
          {
            name: "Date",
            value: new Date(event.date).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
            inline: true,
          },
          { name: "Soumis par", value: who, inline: true },
          {
            name: "Lien admin",
            value: `${process.env.NEXT_PUBLIC_BASE_URL || "https://ziben.onrender.com"}/admin`,
            inline: false,
          },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  });
}

export async function notifyBoost(event: {
  id: string;
  title: string;
  days: number;
  amount: number;
}) {
  await sendDiscord({
    embeds: [
      {
        title: "⚡ Nouveau boost payé",
        description: `**${event.title}** est maintenant en vedette.`,
        color: 0xeab308,
        fields: [
          { name: "Durée", value: `${event.days} jours`, inline: true },
          {
            name: "Montant",
            value: `${(event.amount / 100).toFixed(2)} €`,
            inline: true,
          },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  });
}
