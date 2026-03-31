/**
 * fetch-events.mjs
 * Récupère les events du jour depuis l'API Kefa
 */

const BASE_URL = process.env.KEFA_BASE_URL || 'https://kefa.app';

export async function fetchTodayEvents(limit = 4) {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const url = `${BASE_URL}/api/events?limit=${limit}&sortBy=popularity`;
  const res = await fetch(url);

  if (!res.ok) throw new Error(`API error: ${res.status}`);

  const data = await res.json();
  const events = data.events || data;

  // Filtrer : events d'aujourd'hui ou de ce soir
  const now = new Date();
  const todayEvents = events.filter(ev => {
    const evDate = new Date(ev.date);
    return evDate.toISOString().split('T')[0] === today && evDate > now;
  });

  // Si pas assez d'events aujourd'hui, prendre les prochains
  return todayEvents.length >= 2 ? todayEvents : events.slice(0, limit);
}

export function buildCaption(events, dateLabel) {
  const lines = events.slice(0, 3).map(ev => {
    const time = new Date(ev.date).toLocaleTimeString('fr-FR', {
      hour: '2-digit', minute: '2-digit'
    });
    const price = ev.isFree ? 'Gratuit' : (ev.price ? `${ev.price}€` : '');
    const location = ev.city || 'Nice';
    return `• ${ev.title} · ${time} · ${location}${price ? ' · ' + price : ''}`;
  });

  return [
    `kefa ${dateLabel.toLowerCase()} ? 🔥`,
    '',
    ...lines,
    '',
    'Tous les bons plans de la Côte d\'Azur 👇',
    'kefa.fr',
    '',
    '#kefa #Nice #CotedAzur #sortirNice #bonsplansNice #NiceVilleAzur #riviera #nicelife #cotedazur #evenementsnice'
  ].join('\n');
}

export function getDateLabel() {
  const now = new Date();
  const hour = now.getHours();
  if (hour < 12) return 'ce matin';
  if (hour < 17) return 'cet après-midi';
  return 'ce soir';
}
