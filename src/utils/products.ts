// صفحات المنتجات (6.3) و«من أعمالنا الأخيرة». الرابط /products/<slug>/ (عربي) و/en/products/<slug>/ (4.1).
// النص الإنجليزي لا تُبنى صفحته إلا بعد المراجعة (reviewed: true، 24.5). المسودات تظهر في التطوير فقط.
import { getCollection, type CollectionEntry } from 'astro:content';
import { localePrefix, type Locale } from '~/utils/site';
import { PRICE_UNIT_LABELS } from '~/utils/taxonomy';

export type ProductEntry = CollectionEntry<'products'>;

export const productHref = (lang: Locale, id: string) => `${localePrefix(lang)}/products/${id}/`;

const visible = (p: ProductEntry) =>
  p.data.status === 'published' || (import.meta.env.DEV && p.data.status === 'draft');

/** هل تُبنى صفحة المنتج بهذه اللغة؟ */
export const hasLang = (p: ProductEntry, lang: Locale) =>
  lang === 'ar' ? !!p.data.ar : !!p.data.en && (p.data.en.reviewed || import.meta.env.DEV);

export async function getProducts(lang: Locale) {
  return (await getCollection('products')).filter(visible).filter((p) => hasLang(p, lang));
}

// الدينار بثلاث خانات عشرية عند الكسر: 1.250 لا 1.25
export const kwd = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(3));

/** العرض الساري اليوم (حتى نهاية يوم until)، وإلا undefined */
export const activeOffer = (p: ProductEntry, now = new Date()) => {
  const o = p.data.offer;
  if (!o?.active) return undefined;
  const end = new Date(o.until);
  end.setUTCHours(23, 59, 59, 999);
  return end >= now ? o : undefined;
};

/** نص السعر المختصر للبطاقات: «من 5 إلى 15 د.ك للمتر المربع» أو «حسب المقاس» */
export const priceLine = (p: ProductEntry, lang: Locale) => {
  const d = p.data;
  const ar = lang === 'ar';
  const cur = ar ? 'د.ك' : 'KWD';
  const u = (x: keyof typeof PRICE_UNIT_LABELS) => PRICE_UNIT_LABELS[x][lang];
  if (d.price) return `${kwd(d.price.amount)} ${cur} ${u(d.price.unit)}`;
  if (d.priceRange)
    return ar
      ? `من ${kwd(d.priceRange.min)} إلى ${kwd(d.priceRange.max)} ${cur} ${u(d.priceRange.unit)}`
      : `${kwd(d.priceRange.min)}–${kwd(d.priceRange.max)} ${cur} ${u(d.priceRange.unit)}`;
  return ar ? 'السعر حسب المقاس' : 'Priced by size';
};

/** نص ثنائي «عربي / English»: يعيد جزء اللغة المطلوبة */
export const pickLang = (s: string | undefined, lang: Locale) => {
  if (!s) return undefined;
  const [ar, en] = s.split(' / ');
  return (lang === 'ar' ? ar : (en ?? ar)).trim();
};

/** لون «0004 كريمي / Cream» ← { code: '0004', name } */
export const colorParts = (c: string, lang: Locale) => {
  const m = c.match(/^(\S+)\s+(.+)$/);
  if (!m || !/\d/.test(m[1])) return { code: '', name: pickLang(c, lang) ?? c };
  return { code: m[1], name: pickLang(m[2], lang) ?? m[2] };
};

export async function getProductPaths(lang: Locale) {
  const list = await getProducts(lang);
  const other: Locale = lang === 'ar' ? 'en' : 'ar';
  return list.map((entry) => ({
    params: { slug: entry.id },
    props: {
      entry,
      alternates: {
        [lang]: productHref(lang, entry.id),
        ...(hasLang(entry, other) ? { [other]: productHref(other, entry.id) } : {}),
      } as { en?: string; ar?: string },
      // منتجات مشابهة: التصنيف نفسه أو مكان مشترك (6.3 بند 9)
      similar: list
        .filter((p) => p !== entry)
        .filter(
          (p) => p.data.category === entry.data.category || p.data.places.some((x) => entry.data.places.includes(x))
        )
        .slice(0, 4)
        .map((p) => ({ text: p.data[lang]!.name, href: productHref(lang, p.id) })),
    },
  }));
}

/** «من أعمالنا الأخيرة»: منتجات فعّل فيها الخيار مع منطقة، الأحدث أولًا */
export async function getLatestWorks(lang: Locale) {
  return (await getProducts(lang))
    .filter((p) => p.data.latestWork?.show && p.data.latestWork.area)
    .sort((a, b) => (b.data.latestWork?.date?.getTime() ?? 0) - (a.data.latestWork?.date?.getTime() ?? 0));
}
