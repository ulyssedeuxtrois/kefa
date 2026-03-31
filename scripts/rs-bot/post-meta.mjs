/**
 * post-meta.mjs
 * Poste sur Instagram Business et Facebook Page via Meta Graph API v19
 *
 * Secrets requis :
 *   META_ACCESS_TOKEN  — Long-lived Page Access Token
 *   IG_USER_ID         — ID du compte Instagram Business
 *   FB_PAGE_ID         — ID de la Facebook Page
 */

const API = 'https://graph.facebook.com/v19.0';
const TOKEN = process.env.META_ACCESS_TOKEN;

// ─── Instagram ────────────────────────────────────────────────────────────────

export async function postToInstagram(imageUrl, caption) {
  const igId = process.env.IG_USER_ID;
  if (!igId || !TOKEN) throw new Error('IG_USER_ID ou META_ACCESS_TOKEN manquant');

  console.log('[Instagram] Création du container...');
  const containerRes = await fetch(`${API}/${igId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_url: imageUrl, caption, access_token: TOKEN })
  });

  const container = await containerRes.json();
  if (container.error) throw new Error(`[Instagram] Container error: ${container.error.message}`);

  // Attendre que Meta traite l'image (3-10s)
  await wait(5000);

  console.log('[Instagram] Publication...');
  const publishRes = await fetch(`${API}/${igId}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ creation_id: container.id, access_token: TOKEN })
  });

  const result = await publishRes.json();
  if (result.error) throw new Error(`[Instagram] Publish error: ${result.error.message}`);

  console.log(`[Instagram] ✅ Posté — ID: ${result.id}`);
  return result;
}

// ─── Facebook Page ─────────────────────────────────────────────────────────────

export async function postToFacebook(imageUrl, message) {
  const pageId = process.env.FB_PAGE_ID;
  if (!pageId || !TOKEN) throw new Error('FB_PAGE_ID ou META_ACCESS_TOKEN manquant');

  console.log('[Facebook] Publication...');
  const res = await fetch(`${API}/${pageId}/photos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: imageUrl, message, access_token: TOKEN })
  });

  const result = await res.json();
  if (result.error) throw new Error(`[Facebook] Error: ${result.error.message}`);

  console.log(`[Facebook] ✅ Posté — ID: ${result.id}`);
  return result;
}

// ─── Instagram Reel (vidéo) ────────────────────────────────────────────────────

export async function postReelToInstagram(videoPath, caption) {
  const igId = process.env.IG_USER_ID;
  if (!igId || !TOKEN) throw new Error('IG_USER_ID ou META_ACCESS_TOKEN manquant');

  // Upload vers Cloudinary pour avoir une URL publique
  const { uploadImage } = await import('./upload-cloudinary.mjs');
  const videoUrl = await uploadImage(videoPath, `reel-${Date.now()}`);

  console.log('[Instagram Reel] Création container vidéo...');
  const containerRes = await fetch(`${API}/${igId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      media_type: 'REELS',
      video_url: videoUrl,
      caption,
      share_to_feed: true,
      access_token: TOKEN
    })
  });

  const container = await containerRes.json();
  if (container.error) throw new Error(`[Reel] Container error: ${container.error.message}`);

  // Attendre le traitement vidéo (peut prendre 10-30s)
  console.log('[Instagram Reel] Traitement vidéo en cours...');
  await waitForVideoReady(igId, container.id);

  const publishRes = await fetch(`${API}/${igId}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ creation_id: container.id, access_token: TOKEN })
  });

  const result = await publishRes.json();
  if (result.error) throw new Error(`[Reel] Publish error: ${result.error.message}`);

  console.log(`[Instagram Reel] ✅ Posté — ID: ${result.id}`);
  return result;
}

async function waitForVideoReady(igId, containerId, maxAttempts = 12) {
  for (let i = 0; i < maxAttempts; i++) {
    await wait(5000);
    const res = await fetch(
      `${API}/${containerId}?fields=status_code&access_token=${TOKEN}`
    );
    const data = await res.json();
    if (data.status_code === 'FINISHED') return;
    if (data.status_code === 'ERROR') throw new Error('[Reel] Video processing failed');
    console.log(`[Instagram Reel] Status: ${data.status_code} (${i + 1}/${maxAttempts})`);
  }
  throw new Error('[Reel] Timeout — video processing too long');
}

// ─── Instagram Story ───────────────────────────────────────────────────────────

export async function postStoryToInstagram(imageUrl) {
  const igId = process.env.IG_USER_ID;
  if (!igId || !TOKEN) throw new Error('IG_USER_ID ou META_ACCESS_TOKEN manquant');

  console.log('[Instagram Story] Création du container...');
  const containerRes = await fetch(`${API}/${igId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image_url: imageUrl,
      media_type: 'IMAGE',
      // Stories sont publiées via le même endpoint mais sans caption
      access_token: TOKEN
    })
  });

  const container = await containerRes.json();
  if (container.error) throw new Error(`[Story] Container error: ${container.error.message}`);

  await wait(5000);

  const publishRes = await fetch(`${API}/${igId}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ creation_id: container.id, access_token: TOKEN })
  });

  const result = await publishRes.json();
  if (result.error) throw new Error(`[Story] Publish error: ${result.error.message}`);

  console.log(`[Instagram Story] ✅ Postée — ID: ${result.id}`);
  return result;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
