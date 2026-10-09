// مسارات مجموعة pages (الخطوة 9، الخطة 4.1 و24.5).
// كل ملف Markdown لغة واحدة، ويربط الزوجَ translationKey. الرابط من urlPath في الملف نفسه.
// يفشل البناء (24.5) عند: صفحة منشورة بلا زوج (إلا مع noTranslation)، أب غير موجود، رابط مكرر.
import { getCollection, type CollectionEntry } from 'astro:content';
import { localePrefix, type Locale } from '~/utils/site';

export type PageEntry = CollectionEntry<'pages'>;

/** /mosque-carpets/ (عربي، الجذر) أو /en/mosque-carpet/ */
export const pageHref = (lang: Locale, urlPath: string) => `${localePrefix(lang)}/${urlPath}/`;

const HOME = { en: { text: 'Home', href: '/en/' }, ar: { text: 'الرئيسية', href: '/' } };

// المسودات تظهر في التطوير فقط، ولا تدخل البناء ولا الخريطة.
const visible = (e: PageEntry) => e.data.status === 'published' || (import.meta.env.DEV && e.data.status === 'draft');

export async function getPageProps(lang: Locale) {
  const all = (await getCollection('pages')).filter(visible);
  const byKey = (l: Locale, key: string) => all.find((e) => e.data.lang === l && e.data.translationKey === key);
  const other: Locale = lang === 'ar' ? 'en' : 'ar';

  const seen = new Map<string, string>();
  for (const e of all) {
    const href = pageHref(e.data.lang, e.data.urlPath);
    if (seen.has(href)) throw new Error(`رابط مكرر ${href} في ${seen.get(href)} و ${e.id}`);
    seen.set(href, e.id);
  }

  return all
    .filter((e) => e.data.lang === lang && e.data.kind !== 'home') // الرئيسيتان في index.astro
    .map((entry) => {
      const d = entry.data;
      const pair = byKey(other, d.translationKey);
      if (!pair && !d.noTranslation && d.status === 'published')
        throw new Error(
          `${entry.id}: لا زوج بلغة ${other} للمفتاح "${d.translationKey}" (أضفه أو اضبط noTranslation: true)`
        );

      // سلسلة الآباء لمسار التنقل: الرئيسية ← ... ← الصفحة
      const chain: PageEntry[] = [];
      let parentKey = d.parent;
      while (parentKey) {
        const parent = byKey(lang, parentKey);
        if (!parent) throw new Error(`${entry.id}: الأب "${parentKey}" غير موجود بلغة ${lang}`);
        if (chain.includes(parent)) throw new Error(`${entry.id}: حلقة في سلسلة الآباء`);
        chain.unshift(parent);
        parentKey = parent.data.parent;
      }

      const href = pageHref(lang, d.urlPath);
      return {
        params: { slug: d.urlPath },
        props: {
          entry,
          href,
          alternates: {
            [lang]: href,
            ...(pair ? { [other]: pageHref(other, pair.data.urlPath) } : {}),
          } as { en?: string; ar?: string },
          breadcrumbs: [
            HOME[lang],
            ...chain.map((p) => ({ text: p.data.h1, href: pageHref(lang, p.data.urlPath) })),
            { text: d.h1 },
          ],
          // الأب والأبناء المباشرون والأشقاء: روابط داخلية تلقائية (6.1) تُضاف لما يكتبه المحرر
          related: [
            ...chain.slice(-1).map((p) => ({ text: p.data.h1, href: pageHref(lang, p.data.urlPath) })),
            ...all
              .filter((e) => e.data.lang === lang && e !== entry && e.data.kind !== 'home')
              .filter((e) => e.data.parent === d.translationKey || (d.parent && e.data.parent === d.parent))
              .map((e) => ({ text: e.data.h1, href: pageHref(lang, e.data.urlPath) })),
          ],
        },
      };
    });
}
