// حواجز الجودة بعد البناء (خطة 15.5 و16.1 و26.2). تُشغَّل على مجلد dist.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import yaml from 'js-yaml';
import { parse } from 'node-html-parser';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SITE = String(yaml.load(fs.readFileSync(path.join(ROOT, 'src/config.yaml'), 'utf8')).site.site).replace(
  /\/$/,
  ''
);

// ميزانية الأداء (16.1) بالبايت المضغوط gzip
const BUDGET = { html: 40 * 1024, css: 30 * 1024, js: 30 * 1024, fonts: 60 * 1024, fontFiles: 2 };

const errors = [];
const warnings = [];
const gz = (buf) => zlib.gzipSync(buf, { level: 9 }).length;

const walk = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));

const urlOf = (file) => {
  const rel = path.relative(DIST, file).split(path.sep).join('/');
  return '/' + rel.replace(/(^|\/)index\.html$/, '$1');
};
const fileOf = (url) => {
  const clean = url.split('#')[0].split('?')[0];
  const direct = path.join(DIST, clean);
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return direct;
  const idx = path.join(DIST, clean, 'index.html');
  return fs.existsSync(idx) ? idx : null;
};

const htmlFiles = walk(DIST).filter(
  (f) => f.endsWith('.html') && !f.endsWith('404.html') && !['admin', 'invoice', 'verify'].some((d) => f.includes(`${path.sep}${d}${path.sep}`)) // لوحة الإدارة وتطبيق الفواتير وصفحة التحقق خارج الحواجز
);
const pages = new Map();
for (const f of htmlFiles) {
  const html = fs.readFileSync(f);
  const root = parse(html.toString('utf8'));
  const robots = root.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '';
  pages.set(urlOf(f), { file: f, html, root, noindex: /noindex/i.test(robots) });
}

const titles = new Map();
const descs = new Map();
const inbound = new Map([...pages.keys()].map((u) => [u, 0]));

for (const [url, p] of pages) {
  const e = (msg) => errors.push(`${url}: ${msg}`);
  const { root } = p;

  // lang و dir (بند 38)
  const html = root.querySelector('html');
  const wantLang = url.startsWith('/ar/') || url === '/ar/' ? 'ar' : 'en';
  if (html?.getAttribute('lang') !== wantLang) e(`lang يجب أن يكون ${wantLang}`);
  if (html?.getAttribute('dir') !== (wantLang === 'ar' ? 'rtl' : 'ltr')) e(`dir خاطئ`);

  // الميزانية: HTML
  if (gz(p.html) > BUDGET.html) e(`HTML ${(gz(p.html) / 1024).toFixed(1)}KB يتجاوز ${BUDGET.html / 1024}KB`);

  // CSS و JS و خطوط
  let css = 0,
    js = 0;
  const fonts = new Set();
  for (const l of root.querySelectorAll('link[rel="stylesheet"]')) {
    const f = fileOf(l.getAttribute('href') ?? '');
    if (f) {
      const b = fs.readFileSync(f);
      css += gz(b);
      for (const m of b.toString().matchAll(/url\(["']?([^"')]+\.woff2)/g)) fonts.add(m[1]);
    }
  }
  for (const s of root.querySelectorAll('style')) {
    css += gz(Buffer.from(s.text));
    for (const m of s.text.matchAll(/url\(["']?([^"')]+\.woff2)/g)) fonts.add(m[1]);
  }
  for (const s of root.querySelectorAll('script')) {
    if ((s.getAttribute('type') ?? '') === 'application/ld+json') continue;
    const src = s.getAttribute('src');
    if (src) {
      const f = fileOf(src);
      if (f) js += gz(fs.readFileSync(f));
    } else js += gz(Buffer.from(s.text));
  }
  if (css > BUDGET.css) e(`CSS ${(css / 1024).toFixed(1)}KB يتجاوز ${BUDGET.css / 1024}KB`);
  if (js > BUDGET.js) e(`JavaScript ${(js / 1024).toFixed(1)}KB يتجاوز ${BUDGET.js / 1024}KB`);
  let fontBytes = 0;
  for (const f of fonts) {
    const ff = fileOf(f);
    if (ff) fontBytes += fs.statSync(ff).size;
  }
  if (fonts.size > BUDGET.fontFiles) e(`${fonts.size} ملفات خطوط (الحد ${BUDGET.fontFiles})`);
  if (fontBytes > BUDGET.fonts) e(`الخطوط ${(fontBytes / 1024).toFixed(1)}KB تتجاوز ${BUDGET.fonts / 1024}KB`);

  if (p.noindex) continue; // الصفحات noindex تُستثنى من فحوص السيو

  // H1 واحد
  const h1s = root.querySelectorAll('h1').length;
  if (h1s !== 1) e(`يوجد ${h1s} وسوم H1 (المطلوب 1)`);

  // canonical
  const canon = root.querySelector('link[rel="canonical"]')?.getAttribute('href');
  if (!canon) e('canonical مفقود');
  else if (canon !== SITE + url) e(`canonical خاطئ: ${canon} (المتوقع ${SITE + url})`);

  // عنوان ووصف فريدان
  const title = root.querySelector('title')?.text.trim();
  const desc = root.querySelector('meta[name="description"]')?.getAttribute('content')?.trim();
  if (!title) e('عنوان مفقود');
  else if (titles.has(title)) e(`عنوان مكرر مع ${titles.get(title)}`);
  else titles.set(title, url);
  if (!desc) e('وصف مفقود');
  else if (descs.has(desc)) e(`وصف مكرر مع ${descs.get(desc)}`);
  else descs.set(desc, url);

  // وصف بديل للصور
  for (const img of root.querySelectorAll('img')) {
    const alt = img.getAttribute('alt');
    const decorative = img.getAttribute('role') === 'presentation' || img.getAttribute('aria-hidden') === 'true';
    if (alt === undefined || (alt.trim() === '' && !decorative)) e(`صورة بلا وصف بديل: ${img.getAttribute('src')}`);
  }

  // JSON-LD صالح
  for (const s of root.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const d = JSON.parse(s.text);
      const items = Array.isArray(d) ? d : [d];
      for (const it of items) if (!it['@context'] && !it['@graph']) e('JSON-LD بلا @context');
    } catch {
      e('JSON-LD غير صالح');
    }
  }

  // الروابط الداخلية
  for (const a of root.querySelectorAll('a[href]')) {
    const href = a.getAttribute('href');
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const target = fileOf(href);
    if (!target) {
      e(`رابط داخلي مكسور: ${href}`);
      continue;
    }
    const tu = urlOf(target);
    if (tu !== url && inbound.has(tu)) inbound.set(tu, inbound.get(tu) + 1);
  }

  // hreflang متبادل (بند 37)
  const alts = root
    .querySelectorAll('link[rel="alternate"][hreflang]')
    .map((l) => [l.getAttribute('hreflang'), l.getAttribute('href')]);
  if (alts.length) {
    const own = alts.find(([, h]) => h === SITE + url);
    if (!own) e('hreflang بلا إشارة ذاتية');
    for (const [lang, href] of alts) {
      if (lang === 'x-default' || !href.startsWith(SITE)) continue;
      const other = pages.get(href.slice(SITE.length));
      if (!other) {
        e(`hreflang يشير لصفحة غير موجودة: ${href}`);
        continue;
      }
      const back = other.root.querySelectorAll('link[rel="alternate"][hreflang]').map((l) => l.getAttribute('href'));
      if (!back.includes(SITE + url)) e(`hreflang غير متبادل مع ${href}`);
    }
  }
}

// صفحات يتيمة (تحذير) — الرئيسيتان مستثنيتان
for (const [u, n] of inbound)
  if (n === 0 && u !== '/' && u !== '/ar/' && !pages.get(u).noindex) warnings.push(`${u}: صفحة يتيمة بلا روابط واردة`);

// صور أصلية أكبر من 2.5MB (تحذير)
for (const dir of ['src/assets', 'public']) {
  const base = path.join(ROOT, dir);
  if (!fs.existsSync(base)) continue;
  for (const f of walk(base))
    if (/\.(jpe?g|png|webp|avif)$/i.test(f) && fs.statSync(f).size > 2.5 * 1024 * 1024)
      warnings.push(`صورة أكبر من 2.5MB: ${path.relative(ROOT, f)}`);
}

warnings.forEach((w) => console.warn('⚠ ' + w));
errors.forEach((x) => console.error('✗ ' + x));
if (errors.length) {
  console.error(`\nفشلت حواجز الجودة: ${errors.length} خطأ`);
  process.exit(1);
}
console.log(`✓ حواجز الجودة سليمة على ${pages.size} صفحة`);
