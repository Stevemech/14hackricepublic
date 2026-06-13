import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
const result = await page.evaluate(async () => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = 'https://logged-assets.s3.amazonaws.com/trust-badge/2027/mlh-trust-badge-2027-yellow.svg';
  await new Promise(r => { img.onload = r; });
  const W = 400, H = Math.round(400 * img.naturalHeight / img.naturalWidth);
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  ctx.drawImage(img, 0, 0, W, H);
  const row = ctx.getImageData(0, 2, W, 1).data;
  let min = -1, max = -1;
  for (let x = 0; x < W; x++) {
    if (row[x*4+3] > 30) { if (min < 0) min = x; max = x; }
  }
  return { min, max, W, leftPct: (min/W*100).toFixed(2), widthPct: ((max-min+1)/W*100).toFixed(2) };
});
console.log(JSON.stringify(result));
await browser.close();
