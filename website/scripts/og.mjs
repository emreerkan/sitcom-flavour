// Renders /og/ to public/og.png. Needs `pnpm preview` running and a local Chrome.
import puppeteer from 'puppeteer-core';
import { fileURLToPath } from 'node:url';

const chrome = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const url = process.env.OG_URL ?? 'http://localhost:4321/sitcom-flavour/og/';
const out = fileURLToPath(new URL('../public/og.png', import.meta.url));

const browser = await puppeteer.launch({ executablePath: chrome, headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();
console.log(`Wrote ${out}`);
