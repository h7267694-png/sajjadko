import type { Locale } from '~/utils/site';

// القسم 17.1 والروابط المجمّدة من 4.1.
// live:false = الصفحة لم تُبنَ بعد، فلا تظهر في القائمة (حاجز الجودة يفشل البناء عند أي رابط داخلي مكسور).
// عند بناء صفحة غيّر live إلى true.
interface Item {
  text: { en: string; ar: string };
  href: { en: string; ar: string };
  live?: boolean;
  children?: Item[];
}

const item = (en: string, ar: string, hEn: string, hAr: string, live = false, children?: Item[]): Item => ({
  text: { en, ar },
  href: { en: hEn, ar: hAr },
  live,
  children,
});

const NAV: Item[] = [
  // المستوى الأول خمسة عناصر كحد أقصى (قوائم منسدلة): كل صفحة جديدة تدخل تحت مجموعتها فلا يزدحم الرأس على الشاشات المتوسطة.
  // الأب المنسدل زر لا رابط، فلا يلزم بناء /carpets/ قبل ظهوره.
  item('Carpets', 'السجاد', '/carpets/', '/ar/carpets/', false, [
    item('Carpet by the meter', 'سجاد بالمتر', '/carpet-by-the-meter/', '/ar/by-meter/', true),
    item('Hallway runners', 'سجاد الممرات', '/hallway-runners/', '/ar/carpets/hallway/', true),
    item('Stair carpet', 'سجاد الدرج', '/stair-carpet/', '/ar/carpets/stairs/', true),
    item('Mosque carpets', 'سجاد المساجد', '/mosque-carpet/', '/ar/mosque-carpets/'),
    item('Prayer rooms', 'المصلى', '/prayer-room-carpet/', '/ar/mosque-carpets/musalla/'),
    item('Majlis & diwaniya', 'المجالس والديوانيات', '/majlis-diwaniya-carpet/', '/ar/carpets/diwaniya-majlis/'),
    item('Bedrooms', 'غرف النوم', '/bedroom-carpet/', '/ar/carpets/bedroom/'),
    item('Kids rugs', 'الأطفال', '/kids-rugs/', '/ar/carpets/kids/'),
    item('Zawali rugs', 'الزوالي', '/zawali-rugs/', '/ar/zawali/'),
  ]),
  item('Wall-to-wall carpet', 'الموكيت', '/wall-to-wall-carpet/', '/ar/moquette/', true),
  item('Office carpet', 'سجاد المكاتب', '/office-carpet/', '/ar/commercial-flooring/offices/', true, [
    item('Office carpet', 'سجاد وموكيت المكاتب', '/office-carpet/', '/ar/commercial-flooring/offices/', true),
    item('Carpet tiles 40×40', 'بلاط السجاد 40×40', '/carpet-tiles/', '/ar/commercial-flooring/carpet-tiles/', true),
  ]),
  item('Services', 'الخدمات', '/services/carpet-cutting/', '/ar/services/carpet-cutting/', false, [
    item('Carpet cutting', 'قص السجاد', '/services/carpet-cutting/', '/ar/services/carpet-cutting/'),
    item('Hand-carved rugs', 'حفر السجاد', '/services/hand-carved-rugs/', '/ar/services/hand-carving/'),
    item('Installation', 'التركيب', '/services/carpet-installation/', '/ar/services/carpet-installation/'),
  ]),
  item('More', 'المزيد', '/contact/', '/ar/contact/', false, [
    item('Projects', 'المشاريع', '/projects/', '/ar/projects/'),
    item('Guides', 'الأدلة', '/guides/', '/ar/guides/'),
    item('Contact', 'تواصل', '/contact/', '/ar/contact/'),
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
    return i.live ? [{ text: i.text[l], href: i.href[l] }] : [];
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
