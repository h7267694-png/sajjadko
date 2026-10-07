// صفحات المنتجات (6.3) و«من أعمالنا الأخيرة». الرابط /products/<slug>/ و/ar/products/<slug>/ (4.1).
// النص الإنجليزي لا تُبنى صفحته إلا بعد المراجعة (reviewed: true، 24.5). المسودات تظهر في التطوير فقط.
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '~/utils/site';

export type ProductEntry = CollectionEntry<'products'>;

export const productHref = (lang: Locale, id: string) => (lang === 'ar' ? `/ar/products/${id}/` : `/products/${id}/`);

const visible = (p: ProductEntry) =>
  p.data.status === 'published' || (import.meta.env.DEV && p.data.status === 'draft');

/** هل تُبنى صفحة المنتج بهذه اللغة؟ */
export const hasLang = (p: ProductEntry, lang: Locale) =>
  lang === 'ar' ? !!p.data.ar : !!p.data.en && (p.data.en.reviewed || import.meta.env.DEV);

export async function getProducts(lang: Locale) {
  return (await getCollection('products')).filter(visible).filter((p) => hasLang(p, lang));
}

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
