import type { Locale } from '~/utils/site';

// القسم 7.2. النصوص العربية من الخطة حرفيًا. النصوص الإنجليزية مسودة تُراجع من العميل (0.4).
// الأقواس المربعة تبقى ظاهرة ليستبدلها الزائر بنفسه (7.2، ملاحظة صادقة).
export const WA_TYPES = [
  'home',
  'category',
  'mosque',
  'by-meter',
  'cutting',
  'carving',
  'installation',
  'commercial',
  'diwaniya',
  'bedroom-kids',
  'living-room',
  'musalla',
  'hallway',
  'stairs',
  'office',
  'carpet-tiles',
  'shop',
  'zawali',
  'product',
  'project',
  'guide',
  'red-carpet',
  'visit',
] as const;
export type WaType = (typeof WA_TYPES)[number];

interface Tpl {
  label: string;
  msg: string;
  tag?: string;
}

export const WA_TEMPLATES: Record<WaType, { ar: Tpl; en: Tpl }> = {
  // زيارة المندوب المجانية للقياس وعرض العينات (قرار العميل، 7 أكتوبر 2026). الوسم = اسم الصفحة
  visit: {
    ar: {
      label: 'اطلب زيارة مجانية',
      msg: 'مرحبًا، أرغب بزيارة مجانية من المندوب لأخذ المقاسات ومشاهدة العينات. المنطقة: [المنطقة]. نوع المكان: [النوع].',
      tag: 'زيارة مجانية',
    },
    en: {
      label: 'Book a free visit',
      msg: 'Hello, I would like a free visit from your representative to take measurements and see samples. Area: [area]. Type of place: [type].',
      tag: 'Free visit',
    },
  },
  home: {
    ar: {
      label: 'تواصل عبر واتساب',
      msg: 'مرحبًا، أرغب بالاستفسار عن [سجاد/موكيت]. نوع المكان: [النوع].',
      tag: 'الرئيسية',
    },
    en: {
      label: 'Chat on WhatsApp',
      msg: 'Hello, I would like to ask about [carpet/wall-to-wall carpet]. Type of place: [type].',
      tag: 'Home',
    },
  },
  category: {
    ar: { label: 'تواصل عبر واتساب', msg: 'مرحبًا، أرغب بالاستفسار عن [سجاد/موكيت]. نوع المكان: [النوع].' },
    en: {
      label: 'Chat on WhatsApp',
      msg: 'Hello, I would like to ask about [carpet/wall-to-wall carpet]. Type of place: [type].',
    },
  },
  mosque: {
    ar: {
      label: 'اطلب معاينة وقياس المسجد',
      msg: 'مرحبًا، أرغب بمعاينة وتسعير سجاد مسجد. المساحة التقريبية: [المساحة]، المنطقة: [المنطقة].',
      tag: 'سجاد المساجد',
    },
    en: {
      label: 'Request a mosque site visit',
      msg: 'Hello, I would like a site visit and quote for mosque carpet. Approximate size: [size], location: [district].',
      tag: 'Mosque carpets',
    },
  },
  'by-meter': {
    ar: {
      label: 'أرسل المقاسات واحسب الكمية',
      msg: 'مرحبًا، أرغب بحساب كمية وسعر سجاد بالمتر. المقاسات: [الطول × العرض].',
      tag: 'بالمتر',
    },
    en: {
      label: 'Send sizes, get the quantity',
      msg: 'Hello, I would like the quantity and price for carpet by the meter. Sizes: [length × width].',
      tag: 'By the meter',
    },
  },
  cutting: {
    ar: { label: 'أرسل المقاس', msg: 'مرحبًا، أرغب بطلب قص سجاد حسب المقاس. المقاس المطلوب: [المقاس].', tag: 'القص' },
    en: {
      label: 'Send your size',
      msg: 'Hello, I would like carpet cut to size. Required size: [size].',
      tag: 'Cutting',
    },
  },
  carving: {
    ar: {
      label: 'أرسل النقشة أو الصورة',
      msg: 'مرحبًا، أرغب بتنفيذ حفر أو نقش سجاد. سأرسل النقشة أو الصورة.',
      tag: 'الحفر',
    },
    en: {
      label: 'Send your design or photo',
      msg: 'Hello, I would like hand-carved rug work. I will send the design or photo.',
      tag: 'Carving',
    },
  },
  installation: {
    ar: {
      label: 'اطلب معاينة للتركيب',
      msg: 'مرحبًا، أرغب بتركيب [سجاد/موكيت]. المساحة التقريبية: [المساحة]، المنطقة: [المنطقة].',
      tag: 'التركيب',
    },
    en: {
      label: 'Request an installation visit',
      msg: 'Hello, I would like [carpet/wall-to-wall carpet] installed. Approximate area: [area], location: [district].',
      tag: 'Installation',
    },
  },
  commercial: {
    ar: {
      label: 'اطلب معاينة للمشروع',
      msg: 'مرحبًا، أرغب بمعاينة وتسعير [موكيت/سجاد] لـ[مكتب/فندق]. المساحة التقريبية: [المساحة].',
      tag: 'التجاري',
    },
    en: {
      label: 'Request a project visit',
      msg: 'Hello, I would like a visit and quote for [carpet/wall-to-wall carpet] for a [office/hotel]. Approximate area: [area].',
      tag: 'Commercial',
    },
  },
  diwaniya: {
    ar: {
      label: 'اطلب استشارة',
      msg: 'مرحبًا، أرغب باستشارة واختيار سجاد مناسب للديوانية/المجلس. المقاس التقريبي: [المقاس].',
      tag: 'الديوانية',
    },
    en: {
      label: 'Ask for advice',
      msg: 'Hello, I would like advice on choosing carpet for a diwaniya/majlis. Approximate size: [size].',
      tag: 'Diwaniya',
    },
  },
  'bedroom-kids': {
    ar: { label: 'اسأل عن المتوفر', msg: 'مرحبًا، أرغب بسجاد/موكيت لـ[غرفة نوم/غرفة أطفال]. المقاس: [المقاس].' },
    en: { label: 'Ask what is available', msg: 'Hello, I would like carpet for a [bedroom/kids room]. Size: [size].' },
  },
  'living-room': {
    ar: { label: 'اسأل عن سجاد الصالة', msg: 'مرحبًا، أرغب بسجاد للصالة. أبعاد الصالة: [الطول×العرض].' },
    en: {
      label: 'Ask about living room carpet',
      msg: 'Hello, I would like carpet for my living room. Size: [length × width].',
    },
  },
  'red-carpet': {
    ar: {
      label: 'اطلب ريد كاربت لمناسبتك',
      msg: 'مرحبًا، أرغب بريد كاربت (تأجير/شراء) لمناسبة. التاريخ: [التاريخ]، الطول التقريبي: [الطول]، المكان: [المنطقة].',
      tag: 'ريد كاربت',
    },
    en: {
      label: 'Request a red carpet for your event',
      msg: "Hi, I'd like a red carpet (rent/buy) for an event. Date: [date], approx. length: [length], location: [area].",
      tag: 'Red Carpet',
    },
  },
  musalla: {
    ar: {
      label: 'اطلب معاينة للمصلى',
      msg: 'مرحبًا، أرغب بتجهيز مصلى في [جهة/مكان]. المساحة التقريبية: [المساحة].',
      tag: 'المصلى',
    },
    en: {
      label: 'Request a prayer room visit',
      msg: 'Hello, I would like to fit out a prayer room at [place]. Approximate area: [area].',
      tag: 'Prayer room',
    },
  },
  hallway: {
    ar: { label: 'أرسل الطول والعرض', msg: 'مرحبًا، أرغب بسجاد لممر. الطول: [الطول]، العرض: [العرض].', tag: 'الممرات' },
    en: {
      label: 'Send length and width',
      msg: 'Hello, I would like a hallway runner. Length: [length], width: [width].',
      tag: 'Hallways',
    },
  },
  stairs: {
    ar: {
      label: 'أرسل مقاسات الدرج',
      msg: 'مرحبًا، أرغب بسجاد/موكيت لدرج. عدد الدرجات: [العدد]، عرض الدرجة: [العرض].',
      tag: 'الدرج',
    },
    en: {
      label: 'Send stair measurements',
      msg: 'Hello, I would like carpet for stairs. Number of steps: [number], step width: [width].',
      tag: 'Stairs',
    },
  },
  office: {
    ar: {
      label: 'اطلب معاينة للمكتب',
      msg: 'مرحبًا، أرغب بمعاينة وتسعير سجاد/موكيت لمكتب. المساحة: [المساحة]، عدد الطوابق: [العدد].',
      tag: 'المكاتب',
    },
    en: {
      label: 'Request an office visit',
      msg: 'Hello, I would like a visit and quote for office carpet. Area: [area], number of floors: [number].',
      tag: 'Offices',
    },
  },
  'carpet-tiles': {
    ar: {
      label: 'اطلب تسعير بلاط السجاد',
      msg: 'مرحبًا، أرغب بتسعير بلاط سجاد 40×40. المساحة: [المساحة]، الخامة: [نايلون/بولي بروبلين].',
      tag: 'بلاط السجاد',
    },
    en: {
      label: 'Get a carpet tiles quote',
      msg: 'Hello, I would like a quote for 40×40 carpet tiles. Area: [area], material: [nylon/polypropylene].',
      tag: 'Carpet tiles',
    },
  },
  shop: {
    ar: {
      label: 'اسأل عن موعد الزيارة',
      msg: 'مرحبًا، أرغب بزيارة المحل في الضجيج. متى تكونون متواجدين؟',
      tag: 'الضجيج',
    },
    en: {
      label: 'Ask about visiting hours',
      msg: 'Hello, I would like to visit the shop in Al-Dajeej. When are you open?',
      tag: 'Al-Dajeej shop',
    },
  },
  zawali: {
    ar: {
      label: 'اسأل عن المتوفر',
      msg: 'مرحبًا، أرغب بزولية/زل [جاهزة/بالمتر/تفصيل]. المقاس واللون: [المقاس] / [اللون].',
      tag: 'الزوالي',
    },
    en: {
      label: 'Ask what is available',
      msg: 'Hello, I would like a zawali/rug [ready-made/by the metre/custom]. Size and colour: [size] / [colour].',
      tag: 'Zawali',
    },
  },
  product: {
    ar: {
      label: 'اسأل عن هذا المنتج',
      msg: 'مرحبًا، أرغب بالاستفسار عن [اسم المنتج] (رمز: [الرمز]). المقاس المطلوب: [المقاس].',
      tag: 'منتج',
    },
    en: {
      label: 'Ask about this product',
      msg: 'Hello, I would like to ask about [product name] (code: [code]). Required size: [size].',
      tag: 'Product',
    },
  },
  project: {
    ar: {
      label: 'اطلب تنفيذ مشروع مشابه',
      msg: 'مرحبًا، رأيت مشروع [اسم المشروع] وأرغب بتنفيذ مشروع مشابه. نوع المكان: [النوع]، المساحة: [المساحة].',
      tag: 'مشروع',
    },
    en: {
      label: 'Request a similar project',
      msg: 'Hello, I saw the [project name] project and would like a similar one. Type of place: [type], area: [area].',
      tag: 'Project',
    },
  },
  guide: {
    ar: {
      label: 'أرسل المقاسات لنحسب لك',
      msg: 'مرحبًا، قرأت دليل [العنوان] وأرغب بمساعدة. المقاسات: [الطول × العرض].',
      tag: 'دليل',
    },
    en: {
      label: 'Send sizes, we will calculate',
      msg: 'Hello, I read the guide [title] and would like help. Sizes: [length × width].',
      tag: 'Guide',
    },
  },
};

/** رابط واتساب (7.1 بند 7) مع وسم المصدر في نهاية الرسالة (7.1 بند 6). */
/** vars يملأ الحقول بين قوسين في الرسالة، مثل { 'اسم المنتج': 'موكيت تركي مخملي' } */
export function buildWaLink(
  number: string,
  locale: Locale,
  type: WaType,
  pageName?: string,
  vars: Record<string, string> = {}
) {
  const base = WA_TEMPLATES[type][locale];
  const t = { ...base, msg: Object.entries(vars).reduce((m, [k, v]) => m.replaceAll(`[${k}]`, v), base.msg) };
  const source = pageName ?? t.tag ?? '';
  const tag = locale === 'ar' ? `(من صفحة: ${source})` : `(From page: ${source})`;
  const text = `${t.msg} ${tag}`;
  return { href: `https://wa.me/${number}?text=${encodeURIComponent(text)}`, label: t.label, text, source };
}
