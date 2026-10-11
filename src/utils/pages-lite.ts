import { getCollection } from 'astro:content';
import type { Locale } from '~/utils/site';

/** الصفحات المنشورة بلغة واحدة (بلا تحقق الأزواج، للقوائم فقط) */
export async function getPages(lang: Locale) {
  return (await getCollection('pages')).filter((e) => e.data.status === 'published' && e.data.lang === lang);
}
