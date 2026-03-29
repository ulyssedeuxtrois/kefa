// Generate PWA PNG icons from the SVG
// Usage: node scripts/generate-icons.mjs
// Requires: npm install sharp (dev dependency)

import { readFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const svgPath = join(root, 'public', 'icon.svg');
const outDir = join(root, 'public', 'icons');

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

let sharp;
try {
  const module = await import('sharp');
  sharp = module.default;
} catch {
  console.error('sharp not installed. Run: npm install --save-dev sharp');
  process.exit(1);
}

const svgBuffer = readFileSync(svgPath);

const sizes = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'icon-512-maskable.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon-32.png', size: 32 },
];

for (const { name, size } of sizes) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(join(outDir, name));
  console.log(`✓ ${name} (${size}x${size})`);
}

console.log('\n✓ All icons generated in public/icons/');
