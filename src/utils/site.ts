import { getEntry } from 'astro:content';

export type Locale = 'en' | 'ar';

// العربية على الجذر والإنجليزية على /en/ (قرار العميل، 10 أكتوبر 2026، 24.2)
export const toLocale = (l?: string): Locale => (l === 'en' ? 'en' : 'ar');
export const localePrefix = (l: Locale) => (l === 'en' ? '/en' : '');
export const homeHref = (l: Locale) => `${localePrefix(l)}/`;

/** إعدادات الموقع من src/content/settings/site.yaml (رقم واتساب، العنوان، الساعات). */
export async function getSettings() {
  const entry = await getEntry('settings', 'site');
  return entry?.data;
}

/** 96565061072 → +965 6506 1072 (أرقام لاتينية للوضوح، القسم 17.3) */
export const formatPhone = (n: string) => {
  const m = n.match(/^965(\d{4})(\d{4})$/);
  return m ? `+965 ${m[1]} ${m[2]}` : `+${n}`;
};
