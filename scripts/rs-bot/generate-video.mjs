/**
 * generate-video.mjs
 * Génère une vidéo verticale (1080x1920) pour TikTok / Reels / Shorts
 *
 * Pipeline :
 *   1. Puppeteer → PNG frames (intro + N events + outro)
 *   2. FFmpeg → MP4 avec crossfade entre frames
 *
 * Dépendances : puppeteer, @ffmpeg-installer/ffmpeg ou ffmpeg système
 */

import puppeteer from 'puppeteer';
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { tmpdir } from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES = join(__dirname, 'templates');

// Durées en secondes par frame
const DURATIONS = {
  intro: 2.5,
  event: 3.5,
  outro: 2.5
};

// ─── Génération d'un frame PNG via Puppeteer ──────────────────────────────────

async function renderFrame(page, html, outputPath) {
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: outputPath, type: 'png' });
}

function injectData(template, replacements) {
  let html = template;
  for (const [key, value] of Object.entries(replacements)) {
    html = html.replaceAll(key, value);
  }
  return html;
}

// ─── Génération de tous les frames ───────────────────────────────────────────

export async function generateVideoFrames(events) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });

  const framePaths = [];
  const frameDurations = [];
  const tmpDir = tmpdir();

  // ── Intro ──
  const introHtml = readFileSync(join(TEMPLATES, 'video-intro.html'), 'utf-8');
  const introPath = join(tmpDir, `kefa-frame-intro-${Date.now()}.png`);
  await renderFrame(page, introHtml, introPath);
  framePaths.push(introPath);
  frameDurations.push(DURATIONS.intro);
  console.log(`✅ Frame intro générée`);

  // ── Events ──
  const eventTemplate = readFileSync(join(TEMPLATES, 'video-event.html'), 'utf-8');
  const topEvents = events.slice(0, 3);

  for (let i = 0; i < topEvents.length; i++) {
    const ev = topEvents[i];
    const html = injectData(eventTemplate, {
      "'__EVENT_JSON__'": JSON.stringify(ev).replace(/'/g, "\\'"),
      '__EVENT_INDEX__': i,
      '__EVENT_TOTAL__': topEvents.length
    });
    const framePath = join(tmpDir, `kefa-frame-event${i}-${Date.now()}.png`);
    await renderFrame(page, html, framePath);
    framePaths.push(framePath);
    frameDurations.push(DURATIONS.event);
    console.log(`✅ Frame event ${i + 1}/${topEvents.length} générée`);
  }

  // ── Outro ──
  const outroHtml = readFileSync(join(TEMPLATES, 'video-outro.html'), 'utf-8');
  const outroPath = join(tmpDir, `kefa-frame-outro-${Date.now()}.png`);
  await renderFrame(page, outroHtml, outroPath);
  framePaths.push(outroPath);
  frameDurations.push(DURATIONS.outro);
  console.log(`✅ Frame outro générée`);

  await browser.close();
  return { framePaths, frameDurations };
}

// ─── Encodage FFmpeg ──────────────────────────────────────────────────────────

export async function encodeVideo(framePaths, frameDurations, outputPath, musicPath = null) {
  const n = framePaths.length;

  // Construire les inputs
  const inputs = framePaths.map((p, i) =>
    `-loop 1 -t ${frameDurations[i]} -i "${p}"`
  ).join(' ');

  // Construire le filter_complex
  const scaleFilters = framePaths.map((_, i) =>
    `[${i}:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,setsar=1[v${i}]`
  ).join(';');

  // Calculer les offsets des transitions (0.5s de fade entre chaque frame)
  const FADE = 0.4;
  let xfadeFilters = '';
  let offset = 0;

  for (let i = 0; i < n - 1; i++) {
    offset += frameDurations[i] - FADE;
    const inA = i === 0 ? `v${i}` : `x${i}`;
    const inB = `v${i + 1}`;
    const out = i === n - 2 ? 'xout' : `x${i + 1}`;
    xfadeFilters += `;[${inA}][${inB}]xfade=transition=fade:duration=${FADE}:offset=${offset.toFixed(2)}[${out}]`;
  }

  const filterComplex = `"${scaleFilters}${xfadeFilters}"`;

  // Commande FFmpeg
  let cmd = `ffmpeg -y ${inputs} -filter_complex ${filterComplex} -map "[xout]"`;

  // Audio optionnel
  if (musicPath && existsSync(musicPath)) {
    const totalDuration = frameDurations.reduce((a, b) => a + b, 0);
    cmd += ` -i "${musicPath}" -map 1:a -shortest -af "afade=t=out:st=${totalDuration - 1}:d=1"`;
  }

  cmd += ` -c:v libx264 -pix_fmt yuv420p -r 30 "${outputPath}"`;

  console.log('🎬 Encodage FFmpeg...');
  execSync(cmd, { stdio: 'inherit' });
  console.log(`✅ Vidéo générée : ${outputPath}`);

  // Nettoyage des frames
  framePaths.forEach(p => { try { unlinkSync(p); } catch {} });

  return outputPath;
}

// ─── Pipeline complet ─────────────────────────────────────────────────────────

export async function generateVideo(events) {
  const outputPath = join(tmpdir(), `kefa-video-${Date.now()}.mp4`);
  const musicPath = process.env.MUSIC_FILE || null; // optionnel

  const { framePaths, frameDurations } = await generateVideoFrames(events);
  await encodeVideo(framePaths, frameDurations, outputPath, musicPath);

  return outputPath;
}
