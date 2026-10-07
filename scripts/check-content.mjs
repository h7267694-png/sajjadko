// حواجز المحتوى قبل البناء (خطة 15.5): تفرد SKU، وثبات الروابط (slugs.lock.json).
// التشغيل: node scripts/check-content.mjs        للفحص
//          node scripts/check-content.mjs --lock يضيف الروابط المنشورة الجديدة إلى القفل
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const ROOT = path.resolve(import.meta.dirname, '..');
const LOCK = path.join(ROOT, 'slugs.lock.json');
const errors = [];
const warnings = [];

const readData = (dir) => {
  const base = path.join(ROOT, 'src/content', dir);
  if (!fs.existsSync(base)) return [];
  return fs
    .readdirSync(base)
    .filter((f) => /\.(ya?ml|json)$/.test(f))
    .map((f) => {
      const raw = fs.readFileSync(path.join(base, f), 'utf8');
      const data = f.endsWith('.json') ? JSON.parse(raw) : yaml.load(raw);
      return { id: f.replace(/\.[^.]+$/, ''), file: f, data: data ?? {} };
    });
};

const products = readData('products');

// صفحات Markdown (pages): المفتاح lang:urlPath للصفحات المنشورة (الخطوة 9)
const readPages = () => {
  const base = path.join(ROOT, 'src/content/pages');
  if (!fs.existsSync(base)) return [];
  return fs
    .readdirSync(base, { recursive: true })
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => {
      const m = fs.readFileSync(path.join(base, f), 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
      return { file: f, data: (m && yaml.load(m[1])) || {} };
    });
};
const pages = readPages();
const projects = readData('projects');

// 1) تفرد SKU
const seen = new Map();
for (const p of products) {
  const sku = String(p.data.sku ?? '')
    .trim()
    .toLowerCase();
  if (!sku) continue;
  if (seen.has(sku)) errors.push(`SKU مكرر "${p.data.sku}" في ${seen.get(sku)} و ${p.file}`);
  else seen.set(sku, p.file);
}

// 2) ثبات الروابط
const lock = fs.existsSync(LOCK)
  ? JSON.parse(fs.readFileSync(LOCK, 'utf8'))
  : { products: [], projects: [], pages: [] };
const published = {
  products: products.filter((p) => p.data.status === 'published').map((p) => p.id),
  projects: projects.filter((p) => p.data.status === 'published').map((p) => p.id),
  pages: pages.filter((p) => p.data.status === 'published').map((p) => `${p.data.lang}:${p.data.urlPath}`),
};
for (const kind of ['products', 'projects', 'pages']) {
  const locked = lock[kind] ?? [];
  for (const slug of locked) {
    if (!published[kind].includes(slug)) {
      const msg = `${kind}: الرابط المنشور "${slug}" اختفى أو تغيّر أو عاد مسودة. تغيير الرابط بعد النشر يضيع السلطة`;
      // المنتجات تُدار من لوحة الإدارة: حذف منتج أو إيقافه لا يوقف النشر (صفحته تختفي وجوجل يسقطها).
      // الصفحات المكتوبة تبقى صارمة. لإزالة التحذير: node scripts/check-content.mjs --lock --prune
      if (kind === 'products') warnings.push(msg + ' (تحذير فقط)');
      else errors.push(msg);
    }
  }
  const fresh = published[kind].filter((s) => !locked.includes(s));
  if (fresh.length) {
    if (process.argv.includes('--lock')) lock[kind] = [...locked, ...fresh].sort();
    else
      warnings.push(
        `${kind}: روابط منشورة جديدة غير مقفلة: ${fresh.join(', ')} (شغّل: node scripts/check-content.mjs --lock)`
      );
  }
}
if (process.argv.includes('--prune'))
  for (const kind of ['products']) lock[kind] = (lock[kind] ?? []).filter((x) => published[kind].includes(x));
if (process.argv.includes('--lock')) {
  fs.writeFileSync(LOCK, JSON.stringify(lock, null, 2) + '\n');
  console.log('تم تحديث slugs.lock.json');
}

warnings.forEach((w) => console.warn('⚠ ' + w));
errors.forEach((e) => console.error('✗ ' + e));
if (errors.length) process.exit(1);
console.log(`✓ فحص المحتوى سليم (${products.length} منتج، ${projects.length} مشروع)`);
