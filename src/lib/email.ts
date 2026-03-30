import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = "Ziben <noreply@ziben.fr>";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://ziben.onrender.com";

const footer = `
  <div style="margin-top:40px;padding-top:20px;border-top:1px solid #e5e5e5;text-align:center;color:#999;font-size:13px;">
    Ziben &middot; Nice &middot; <a href="${BASE_URL}" style="color:#999;">ziben.onrender.com</a>
  </div>
`;

function wrap(content: string): string {
  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#1a1a1a;line-height:1.6;">
      ${content}
      ${footer}
    </div>
  `;
}

export async function sendWelcomeOrganizer(to: string, name: string) {
  if (!resend) return;
  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: `Bienvenue sur Ziben, ${name} \u{1F44B}`,
      html: wrap(`
        <h1 style="font-size:24px;color:#F97066;margin-bottom:8px;">Bienvenue sur Ziben !</h1>
        <p>Salut <strong>${name}</strong>,</p>
        <p>Ton compte organisateur est cr\u00e9\u00e9. Tu peux maintenant publier tes events et toucher les Ni\u00e7ois en direct.</p>
        <a href="${BASE_URL}/organizer" style="display:inline-block;margin:20px 0;padding:12px 28px;background:#F97066;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
          Acc\u00e9der \u00e0 mon espace
        </a>
        <p>Tu veux publier ton premier event tout de suite ?</p>
        <a href="${BASE_URL}/submit" style="display:inline-block;margin:8px 0 20px;padding:10px 24px;background:#14B8A6;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
          Soumettre un event
        </a>
        <p style="color:#666;">Si tu as des questions, r\u00e9ponds directement \u00e0 cet email.</p>
      `),
    });
  } catch {}
}

export async function sendEventApproved(to: string, event: { title: string; id: string }) {
  if (!resend) return;
  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: `\u2705 Ton event est en ligne sur Ziben`,
      html: wrap(`
        <h1 style="font-size:24px;color:#14B8A6;margin-bottom:8px;">Event approuv\u00e9 !</h1>
        <p>Bonne nouvelle \u2014 <strong>${event.title}</strong> est maintenant visible sur Ziben.</p>
        <a href="${BASE_URL}/events/${event.id}" style="display:inline-block;margin:20px 0;padding:12px 28px;background:#14B8A6;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
          Voir mon event
        </a>
        <p style="color:#666;">Tu veux plus de visibilit\u00e9 ? Boost ton event pour appara\u00eetre en t\u00eate de liste.</p>
        <a href="${BASE_URL}/events/${event.id}" style="color:#F97066;font-weight:600;text-decoration:none;">
          D\u00e9couvrir le boost &rarr;
        </a>
      `),
    });
  } catch {}
}

export async function sendEventSubmitted(to: string, event: { title: string }) {
  if (!resend) return;
  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: `Event re\u00e7u \u2014 en cours de validation`,
      html: wrap(`
        <h1 style="font-size:24px;color:#F97066;margin-bottom:8px;">Event bien re\u00e7u !</h1>
        <p>On a bien re\u00e7u <strong>${event.title}</strong>. Notre \u00e9quipe le valide en g\u00e9n\u00e9ral en quelques heures.</p>
        <div style="margin:24px 0;padding:16px 20px;background:#FFF7ED;border-left:4px solid #F97066;border-radius:4px;">
          <strong>Prochaine \u00e9tape :</strong> tu recevras un email d\u00e8s que ton event sera en ligne.
        </div>
        <p style="color:#666;">Merci de contribuer \u00e0 la vie locale ni\u00e7oise !</p>
      `),
    });
  } catch {}
}
