/**
 * generate-image.mjs
 * Génère les visuels RS (post carré + story) via Puppeteer
 */

import puppeteer from 'puppeteer';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { tmpdir } from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function renderTemplate(templateName, events, dateLabel, viewport) {
  let html = readFileSync(join(__dirname, 'templates', templateName), 'utf-8');
  html = html.replace('__EVENTS_JSON__', JSON.stringify(events).replace(/'/g, "\\'"));
  html = html.replace('__DATE_LABEL__', dateLabel);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.setViewport(viewport);
  await page.setContent(html, { waitUntil: 'networkidle0' });

  // Attendre que les polices soient chargées
  await page.evaluate(() => document.fonts.ready);

  const outputPath = join(tmpdir(), `kefa-${templateName.replace('.html', '')}-${Date.now()}.png`);
  await page.screenshot({ path: outputPath, type: 'png' });
  await browser.close();

  return outputPath;
}

export async function generatePostImage(events, dateLabel) {
  return renderTemplate('post.html', events, dateLabel, {
    width: 1080,
    height: 1080,
    deviceScaleFactor: 1
  });
}

export async function generateStoryImage(events, dateLabel) {
  return renderTemplate('story.html', events, dateLabel, {
    width: 1080,
    height: 1920,
    deviceScaleFactor: 1
  });
}
