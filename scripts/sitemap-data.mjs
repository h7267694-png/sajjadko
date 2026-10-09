// بيانات خريطة الموقع (19.5 و24.5): لكل رابط منشور أزواج hreflang و lastmod حقيقي.
// - الأزواج من translationKey للصفحات، ومن ملف المنتج نفسه للمنتجات (لا من تطابق المسار).
// - lastmod = تاريخ آخر commit غيّر ملف المصدر (ومنتجاته وصوره إن عرضها)، من git لا من الساعة،
//   فلا يتغير التاريخ إلا إن تغيّر المحتوى فعلًا. يتطلب سجل git كاملًا (fetch-depth: 0 في CI).
// - لا تاريخ لملف لم يُحفظ في git بعد (أفضل من تاريخ غير صحيح).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import yaml from 'js-yaml';

const HREFLANG = { en: 'en-KW', ar: 'ar-KW' };
// العربية على الجذر والإنجليزية على /en/ (10 أكتوبر 2026)
const pre = (lang) => (lang === 'en' ? '/en' : '');

const gitDate = (root, files) => {
  if (!files.length) return undefined;
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', ...files], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return out || undefined;
  } catch {
    return undefined;
  }
};

const frontmatter = (file) => {
  const m = fs.readFileSync(file, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? yaml.load(m[1]) : null;
};

const list = (dir, re) =>
  fs.existsSync(dir)
    ? fs
        .readdirSync(dir, { recursive: true })
        .filter((f) => re.test(f))
        .map((f) => path.join(dir, f))
    : [];

export function sitemapData(root, site) {
  const rel = (f) => path.relative(root, f);
  const url = (p) => new URL(p, site).href;
  const groups = []; // [{ entries: [{lang, url}], sources: [files] }]

  // المنتجات: العربي إن وُجد، والإنجليزي بعد المراجعة فقط (مطابق لـsrc/utils/products.ts)
  const productFiles = list(path.join(root, 'src/content/products'), /\.(ya?ml|json)$/);
  const products = productFiles
    .map((f) => ({ f, d: yaml.load(fs.readFileSync(f, 'utf8')) }))
    .filter(({ d }) => d && d.status === 'published');
  const productSources = (p) => [
    rel(p.f),
    ...(p.d.images ?? [])
      .map((i) => String(i.src))
      .map((s) => (s.startsWith('/') ? s.slice(1) : rel(path.resolve(path.dirname(p.f), s)))),
  ];
  const allProductSources = products.flatMap(productSources);
  for (const p of products) {
    const id = p.d.slug ?? path.basename(p.f).replace(/\.[^.]+$/, '');
    const entries = [];
    if (p.d.ar) entries.push({ lang: 'ar', url: url(`/products/${id}/`) });
    if (p.d.en?.reviewed) entries.push({ lang: 'en', url: url(`/en/products/${id}/`) });
    groups.push({ entries, sources: productSources(p) });
  }

  // الصفحات: الأزواج بـtranslationKey. صفحة تعرض شبكة منتجات تتغير بتغيرها
  const byKey = new Map();
  for (const f of list(path.join(root, 'src/content/pages'), /\.mdx?$/)) {
    const d = frontmatter(f);
    if (!d || d.status !== 'published' || !d.urlPath || d.kind === 'home') continue;
    const g = byKey.get(d.translationKey) ?? { entries: [], sources: [] };
    g.entries.push({ lang: d.lang, url: url(`${pre(d.lang)}/${d.urlPath}/`) });
    g.sources.push(rel(f), ...(d.productGrid ? allProductSources : []));
    byKey.set(d.translationKey, g);
  }
  groups.push(...byKey.values());

  // الرئيسيتان: تتغيران بقالبها وبالمنتجات والصفحات المنشورة التي تعرضها
  groups.push({
    entries: [
      { lang: 'ar', url: url('/') },
      { lang: 'en', url: url('/en/') },
    ],
    sources: ['src/components/widgets/HomePage.astro', 'src/content/pages', ...allProductSources],
  });

  // أعمالنا الأخيرة: تُبنى فقط إن وُجد منتج مفعّل فيه الخيار
  const works = products.filter((p) => p.d.latestWork?.show && p.d.latestWork?.area);
  if (works.length)
    groups.push({
      entries: [
        { lang: 'ar', url: url('/projects/') },
        { lang: 'en', url: url('/en/projects/') },
      ],
      sources: works.flatMap(productSources),
    });

  const map = new Map();
  for (const g of groups) {
    const lastmod = gitDate(root, [...new Set(g.sources)]);
    const links = g.entries.length > 1 ? g.entries.map((e) => ({ lang: HREFLANG[e.lang], url: e.url })) : undefined;
    for (const e of g.entries) map.set(e.url, { links, lastmod });
  }
  return map;
}
