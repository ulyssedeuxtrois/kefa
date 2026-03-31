/**
 * youtube-auth.mjs — Script de setup OAuth2 YouTube (à lancer UNE SEULE FOIS)
 *
 * Usage :
 *   YOUTUBE_CLIENT_ID=xxx YOUTUBE_CLIENT_SECRET=xxx node scripts/rs-bot/youtube-auth.mjs
 *
 * Copie ensuite le refresh_token dans GitHub Secrets : YOUTUBE_REFRESH_TOKEN
 */

import { google } from 'googleapis';
import * as readline from 'readline';

const oauth2 = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  'urn:ietf:wg:oauth:2.0:oob'
);

const authUrl = oauth2.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/youtube.upload']
});

console.log('\n1. Ouvre ce lien dans ton navigateur :');
console.log('\n' + authUrl + '\n');
console.log('2. Autorise l\'accès et copie le code affiché\n');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question('3. Colle le code ici : ', async (code) => {
  const { tokens } = await oauth2.getToken(code.trim());
  console.log('\n✅ Tokens obtenus :');
  console.log('YOUTUBE_REFRESH_TOKEN=' + tokens.refresh_token);
  console.log('\nAjoute ce token dans les GitHub Secrets.');
  rl.close();
});
