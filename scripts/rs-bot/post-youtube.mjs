/**
 * post-youtube.mjs
 * Upload une vidéo sur YouTube Shorts via YouTube Data API v3
 *
 * Setup (une seule fois) :
 *   1. Google Cloud Console → créer projet → activer "YouTube Data API v3"
 *   2. Créer des credentials OAuth2 (type "Desktop app")
 *   3. Lancer le script de setup : node scripts/rs-bot/youtube-auth.mjs
 *   4. Copier le refresh_token dans les GitHub Secrets
 *
 * Secrets requis :
 *   YOUTUBE_CLIENT_ID
 *   YOUTUBE_CLIENT_SECRET
 *   YOUTUBE_REFRESH_TOKEN
 */

import { google } from 'googleapis';
import { createReadStream, statSync } from 'fs';

function getOAuth2Client() {
  const oauth2 = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    'urn:ietf:wg:oauth:2.0:oob'
  );
  oauth2.setCredentials({ refresh_token: process.env.YOUTUBE_REFRESH_TOKEN });
  return oauth2;
}

export async function postToYouTubeShorts(videoPath, title, description) {
  const auth = getOAuth2Client();
  const youtube = google.youtube({ version: 'v3', auth });

  console.log('[YouTube Shorts] Upload en cours...');
  console.log(`  Fichier : ${videoPath} (${(statSync(videoPath).size / 1024 / 1024).toFixed(1)} MB)`);

  const res = await youtube.videos.insert({
    part: ['snippet', 'status'],
    requestBody: {
      snippet: {
        title: title.slice(0, 100), // YouTube max 100 chars
        description,
        tags: ['kefa', 'Nice', 'CotedAzur', 'sortirNice', 'bonsplans', 'NiceVilleAzur', 'riviera', 'sorties'],
        categoryId: '22', // People & Blogs
        defaultLanguage: 'fr',
        defaultAudioLanguage: 'fr'
      },
      status: {
        privacyStatus: 'public',
        madeForKids: false,
        selfDeclaredMadeForKids: false
      }
    },
    media: {
      mimeType: 'video/mp4',
      body: createReadStream(videoPath)
    }
  });

  console.log(`[YouTube Shorts] ✅ Uploadé — ID: ${res.data.id}`);
  console.log(`  https://www.youtube.com/shorts/${res.data.id}`);
  return res.data;
}
