// أزواج hreflang لخريطة الموقع (24.5): الزوج يربطه translationKey لا تطابق المسار،
// فخيار i18n في @astrojs/sitemap وحده لا يكفي (/mosque-carpet/ ↔ /ar/mosque-carpets/).
// يقرأ مقدمات ملفات src/content/pages ويعيد خريطة: الرابط الكامل ← [{lang, url}].
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const HREFLANG = { en: 'en-KW', ar: 'ar-KW' };

export function pageAlternates(root, site) {
  const base = path.join(root, 'src/content/pages');
  const files = fs.existsSync(base) ? fs.readdirSync(base, { recursive: true }).filter((f) => /\.mdx?$/.test(f)) : [];
  const groups = new Map();
  for (const f of files) {
    const m = fs.readFileSync(path.join(base, f), 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const d = m ? yaml.load(m[1]) : null;
    if (!d || d.status !== 'published' || !d.urlPath || d.kind === 'home') continue;
    const url = new URL(d.lang === 'ar' ? `/ar/${d.urlPath}/` : `/${d.urlPath}/`, site).href;
    if (!groups.has(d.translationKey)) groups.set(d.translationKey, []);
    groups.get(d.translationKey).push({ lang: HREFLANG[d.lang], url });
  }
  // الرئيسيتان
  groups.set('__home', [
    { lang: 'en-KW', url: new URL('/', site).href },
    { lang: 'ar-KW', url: new URL('/ar/', site).href },
  ]);
  const map = new Map();
  for (const links of groups.values()) if (links.length > 1) for (const l of links) map.set(l.url, links);
  return map;
}
