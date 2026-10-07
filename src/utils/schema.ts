// توليد JSON-LD من بيانات الإعدادات فقط (14.6.6 و19.4). لا حقل يُكتب بلا قيمة مؤكدة:
// لا تقييمات، لا إحداثيات، لا ساعات، ولا روابط خرائط (قرار العميل: بلا GBP).
import type { Locale } from '~/utils/site';

interface Bi {
  en?: string;
  ar?: string;
}
export interface SettingsData {
  brand: { en: string; ar: string };
  whatsapp?: string;
  address?: Bi;
  hours?: Bi;
  social?: { instagram?: string };
}

const clean = <T extends Record<string, unknown>>(o: T) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== '')) as T;

const KUWAIT = { '@type': 'Country', name: 'Kuwait' };

/** العنوان المركّب: الكويت / الضجيج / المجمع / السرداب / المخزن */
function postalAddress(s: SettingsData, l: Locale) {
  if (!s.address?.[l]) return undefined;
  const [, area, ...rest] = s.address[l]!.split('–').map((x) => x.trim());
  return clean({
    '@type': 'PostalAddress',
    streetAddress: rest.join(', ') || undefined,
    addressLocality: area,
    addressCountry: 'KW',
  });
}

export function buildHomeSchema(s: SettingsData, l: Locale, site: URL) {
  const base = site.href.replace(/\/$/, '');
  const home = l === 'ar' ? `${base}/ar/` : `${base}/`;
  const orgId = `${base}/#organization`;
  const sameAs = s.social?.instagram ? [s.social.instagram] : undefined;
  const telephone = s.whatsapp ? `+${s.whatsapp}` : undefined;

  const organization = clean({
    '@type': 'Organization',
    '@id': orgId,
    name: s.brand[l],
    alternateName: l === 'ar' ? s.brand.en : s.brand.ar,
    url: `${base}/`,
    logo: `${base}/brand/icon-512.png`,
    telephone,
    sameAs,
  });

  const store = clean({
    '@type': 'HomeGoodsStore',
    '@id': `${base}/#store`,
    name: s.brand[l],
    url: home,
    inLanguage: l,
    telephone,
    address: postalAddress(s, l),
    areaServed: KUWAIT,
    parentOrganization: { '@id': orgId },
    sameAs,
    // زيارة المندوب المجانية (قرار العميل): عرض بسعر صفر لخدمة القياس وعرض العينات
    makesOffer: {
      '@type': 'Offer',
      price: 0,
      priceCurrency: 'KWD',
      areaServed: KUWAIT,
      itemOffered: {
        '@type': 'Service',
        name: l === 'ar' ? 'زيارة مجانية للقياس وعرض العينات' : 'Free home visit to measure and show samples',
        description:
          l === 'ar'
            ? 'مندوب يزور البيت أو الموقع في الكويت، يأخذ المقاسات ويعرض عينات الخامات والألوان، دون أي رسوم.'
            : 'A representative visits your home or site in Kuwait to take measurements and show material and colour samples, at no charge.',
      },
    },
  });

  const website = {
    '@type': 'WebSite',
    '@id': `${base}/#website`,
    name: s.brand[l],
    url: home,
    inLanguage: l,
    publisher: { '@id': orgId },
  };

  return [{ '@context': 'https://schema.org', '@graph': [organization, store, website] }];
}
