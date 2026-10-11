// قوائم محدودة الطول (الخطوة 61): الصفحة تحمل أول PAGE_SIZE عنصرًا فقط، والباقي يُجلب عند الضغط على
// «عرض المزيد» من ملفات /frag/ (HTML جاهز، محظور على الزواحف وخارج الخريطة). هكذا لا يكبر حجم الصفحة
// ولا عدد صورها مهما زادت المنتجات والأعمال، فلا يتجاوز ميزانية HTML ولا يطول Speed Index.
import { getPages } from '~/utils/pages-lite';
import { getProducts, getLatestWorks, type ProductEntry } from '~/utils/products';
import type { Locale } from '~/utils/site';

export const PAGE_SIZE = 12;

export type GridFilter = { categories?: string[]; places?: string[]; services?: string[] };

const workTime = (p: ProductEntry) => (p.data.latestWork?.show && p.data.latestWork.date ? +p.data.latestWork.date : 0);

/** منتجات شبكة الصفحة: الأعمال المنفذة أولًا (الأحدث)، ثم بالرمز */
export async function gridItems(lang: Locale, f: GridFilter) {
  return (await getProducts(lang))
    .filter((p) => !f.categories?.length || f.categories.includes(p.data.category))
    .filter((p) => !f.places?.length || p.data.places.some((x) => f.places!.includes(x)))
    .filter((p) => !f.services?.length || (p.data.services ?? []).some((x) => f.services!.includes(x)))
    .sort((a, b) => workTime(b) - workTime(a) || a.data.sku.localeCompare(b.data.sku));
}

/** كل الصفحات التي فيها شبكة منتجات، مع قائمتها، للغة واحدة */
export async function gridLists(lang: Locale) {
  const pages = await getPages(lang);
  const out: { key: string; items: ProductEntry[] }[] = [];
  for (const e of pages)
    if (e.data.productGrid) out.push({ key: e.data.translationKey, items: await gridItems(lang, e.data.productGrid) });
  return out;
}

export const worksList = (lang: Locale) => getLatestWorks(lang);

export const chunk = <T>(items: T[], n = PAGE_SIZE) =>
  Array.from({ length: Math.ceil(items.length / n) }, (_, i) => items.slice(i * n, i * n + n));

export const fragHref = (lang: Locale, list: string, page: number) => `/frag/${lang}/${list}/${page}/`;
