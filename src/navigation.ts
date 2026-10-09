import type { Locale } from '~/utils/site';

// القسم 17.1 والروابط المجمّدة من 4.1.
// live:false = الصفحة لم تُبنَ بعد، فلا تظهر في القائمة (حاجز الجودة يفشل البناء عند أي رابط داخلي مكسور).
// عند بناء صفحة غيّر live إلى true، أو إلى 'ar' لصفحة عربية فقط (noTranslation، قاعدة 70% العربية في 24.2).
interface Item {
  text: { en: string; ar: string };
  href: { en: string; ar: string };
  live?: boolean | Locale;
  children?: Item[];
}

const item = (
  en: string,
  ar: string,
  hEn: string,
  hAr: string,
  live: boolean | Locale = false,
  children?: Item[]
): Item => ({
  text: { en, ar },
  href: { en: hEn, ar: hAr },
  live,
  children,
});

const NAV: Item[] = [
  // المستوى الأول خمسة عناصر كحد أقصى (قوائم منسدلة): كل صفحة جديدة تدخل تحت مجموعتها فلا يزدحم الرأس على الشاشات المتوسطة.
  // الأب المنسدل زر لا رابط، فلا يلزم بناء /carpets/ قبل ظهوره.
  item('Carpets', 'السجاد', '/en/carpets/', '/carpets/', false, [
    item('Carpet by the meter', 'سجاد بالمتر', '/en/carpet-by-the-meter/', '/by-meter/', true),
    item('Hallway runners', 'سجاد الممرات', '/en/hallway-runners/', '/carpets/hallway/', true),
    item('Stair carpet', 'سجاد الدرج', '/en/stair-carpet/', '/carpets/stairs/', true),
    item('Mosque carpets', 'سجاد المساجد', '/en/mosque-carpet/', '/mosque-carpets/'),
    item('Prayer rooms', 'سجاد المصليات', '/en/prayer-room-carpet/', '/mosque-carpets/musalla/'),
    item(
      'Majlis & diwaniya',
      'سجاد المجالس والديوانيات',
      '/en/majlis-diwaniya-carpet/',
      '/carpets/diwaniya-majlis/',
      'ar'
    ),
    item('Bedroom carpet', 'سجاد غرف النوم', '/en/bedroom-carpet/', '/carpets/bedroom/', 'ar'),
    item('Kids rugs', 'سجاد الأطفال', '/en/kids-rugs/', '/carpets/kids/', 'ar'),
    item('Zawali rugs', 'الزوالي والزل', '/en/zawali-rugs/', '/zawali/', 'ar'),
  ]),
  item('Wall-to-wall carpet', 'الموكيت', '/en/wall-to-wall-carpet/', '/moquette/', true),
  item('Office carpet', 'سجاد المكاتب', '/en/office-carpet/', '/commercial-flooring/offices/', true, [
    item('Office carpet', 'سجاد وموكيت المكاتب', '/en/office-carpet/', '/commercial-flooring/offices/', true),
    item('Carpet tiles 40×40', 'بلاط السجاد 40×40', '/en/carpet-tiles/', '/commercial-flooring/carpet-tiles/', true),
  ]),
  item('Services', 'الخدمات', '/en/services/carpet-cutting/', '/services/carpet-cutting/', false, [
    item('Carpet cutting', 'قص السجاد', '/en/services/carpet-cutting/', '/services/carpet-cutting/'),
    item('Hand-carved rugs', 'حفر السجاد', '/en/services/hand-carved-rugs/', '/services/hand-carving/'),
    item('Installation', 'التركيب', '/en/services/carpet-installation/', '/services/carpet-installation/'),
  ]),
  item('More', 'المزيد', '/en/contact/', '/contact/', false, [
    item('Carpet shop in Al Dajeej', 'محل سجاد الضجيج', '/en/carpet-store-al-dajeej/', '/carpet-shop-dajeej/', 'ar'),
    item('Our latest work', 'أعمالنا في السجاد', '/en/projects/', '/projects/', true),
    item('Guides', 'الأدلة', '/en/guides/', '/guides/'),
    item('Contact', 'تواصل', '/en/contact/', '/contact/'),
  ]),
];

type Link = { text: string; href: string; links?: Link[] };

const resolve = (items: Item[], l: Locale): Link[] =>
  items.flatMap((i) => {
    const children = i.children
      ? resolve(
          i.children.map((c) => ({ ...c, live: c.live ?? false })),
          l
        )
      : undefined;
    if (children?.length) return [{ text: i.text[l], href: i.href[l], links: children }];
    return i.live === true || i.live === l ? [{ text: i.text[l], href: i.href[l] }] : [];
  });

export const getHeaderLinks = (l: Locale) => resolve(NAV, l);

export const getFooterData = (l: Locale) => ({
  links: [] as { title?: string; links: { text: string; href: string }[] }[],
  secondaryLinks: [] as { text: string; href: string }[],
  socialLinks: [] as { ariaLabel?: string; href: string; icon?: string }[],
  footNote:
    l === 'ar' ? `© ${new Date().getFullYear()} سجادكو الكويت` : `© ${new Date().getFullYear()} Sajjadko Kuwait`,
});

export const headerData = { links: getHeaderLinks('en'), actions: [] };
export const footerData = getFooterData('en');
