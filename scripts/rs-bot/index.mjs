/**
 * rs-bot/index.mjs — Kefa RS Bot
 *
 * Publie chaque soir :
 *   - 1 post image  → Instagram + Facebook
 *   - 1 story image → Instagram
 *   - 1 vidéo       → Instagram Reels + YouTube Shorts (+ TikTok quand dispo)
 *
 * Secrets GitHub requis :
 *   KEFA_BASE_URL          URL de l'app
 *   META_ACCESS_TOKEN      Long-lived Page Access Token Meta
 *   IG_USER_ID             Instagram Business Account ID
 *   FB_PAGE_ID             Facebook Page ID
 *   CLOUDINARY_URL         cloudinary://key:secret@cloud
 *   YOUTUBE_CLIENT_ID      Google Cloud OAuth2 client ID
 *   YOUTUBE_CLIENT_SECRET  Google Cloud OAuth2 client secret
 *   YOUTUBE_REFRESH_TOKEN  Token obtenu via youtube-auth.mjs
 *
 * Usage :
 *   node scripts/rs-bot/index.mjs
 *   DRY_RUN=true node scripts/rs-bot/index.mjs
 *   SKIP_VIDEO=true node scripts/rs-bot/index.mjs   (images seulement)
 */

import { fetchTodayEvents, buildCaption, getDateLabel } from './fetch-events.mjs';
import { generatePostImage, generateStoryImage }        from './generate-image.mjs';
import { generateVideo }                                from './generate-video.mjs';
import { uploadImage }                                  from './upload-cloudinary.mjs';
import { postToInstagram, postToFacebook,
         postStoryToInstagram, postReelToInstagram }    from './post-meta.mjs';
import { postToYouTubeShorts }                          from './post-youtube.mjs';
import { unlinkSync }                                   from 'fs';

const DRY_RUN    = process.env.DRY_RUN    === 'true';
const SKIP_VIDEO = process.env.SKIP_VIDEO === 'true';

async function main() {
  console.log(`\n🚀 Kefa RS Bot — ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}`);
  if (DRY_RUN)    console.log('⚠️  DRY RUN — pas de publication');
  if (SKIP_VIDEO) console.log('⚠️  SKIP_VIDEO — images uniquement');

  // ── 1. Events ─────────────────────────────────────────────────────────────
  console.log('\n📡 Récupération des events...');
  const events = await fetchTodayEvents(4);
  console.log(`✅ ${events.length} events`);

  if (events.length === 0) {
    console.log('❌ Aucun event — arrêt');
    process.exit(0);
  }

  const dateLabel = getDateLabel();
  const caption   = buildCaption(events, dateLabel);
  const videoTitle = `kefa ${dateLabel} ? 🔥 Côte d'Azur`;

  if (DRY_RUN) {
    console.log('\n📝 Caption :\n' + caption);
    console.log('\n[DRY RUN] Fin');
    return;
  }

  // ── 2. Génération images ──────────────────────────────────────────────────
  console.log('\n🎨 Génération des images...');
  const [postImagePath, storyImagePath] = await Promise.all([
    generatePostImage(events, dateLabel),
    generateStoryImage(events, dateLabel)
  ]);
  console.log('✅ Images générées');

  // ── 3. Génération vidéo ───────────────────────────────────────────────────
  let videoPath = null;
  if (!SKIP_VIDEO) {
    console.log('\n🎬 Génération vidéo...');
    videoPath = await generateVideo(events);
    console.log('✅ Vidéo générée');
  }

  // ── 4. Upload Cloudinary ──────────────────────────────────────────────────
  console.log('\n☁️  Upload Cloudinary...');
  const ts = Date.now();
  const [postUrl, storyUrl] = await Promise.all([
    uploadImage(postImagePath, `post-${ts}`),
    uploadImage(storyImagePath, `story-${ts}`)
  ]);
  console.log('✅ Images uploadées');

  // ── 5. Publication images ─────────────────────────────────────────────────
  console.log('\n📱 Publication images...');
  const imageResults = await Promise.allSettled([
    postToInstagram(postUrl, caption),
    postToFacebook(postUrl, caption),
    postStoryToInstagram(storyUrl)
  ]);

  ['Instagram post', 'Facebook post', 'Instagram story'].forEach((label, i) => {
    const r = imageResults[i];
    if (r.status === 'fulfilled') console.log(`  ✅ ${label}`);
    else console.error(`  ❌ ${label} : ${r.reason?.message}`);
  });

  // ── 6. Publication vidéo ──────────────────────────────────────────────────
  if (videoPath) {
    console.log('\n🎬 Publication vidéo...');
    const videoResults = await Promise.allSettled([
      postReelToInstagram(videoPath, caption),
      postToYouTubeShorts(videoPath, videoTitle, caption)
    ]);

    ['Instagram Reel', 'YouTube Shorts'].forEach((label, i) => {
      const r = videoResults[i];
      if (r.status === 'fulfilled') console.log(`  ✅ ${label}`);
      else console.error(`  ❌ ${label} : ${r.reason?.message}`);
    });

    try { unlinkSync(videoPath); } catch {}
  }

  console.log('\n✨ Bot terminé\n');
}

main().catch(err => {
  console.error('💥 Erreur fatale :', err);
  process.exit(1);
});
