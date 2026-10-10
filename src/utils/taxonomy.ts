// قوائم التصنيف المعتمدة (خطة 14.5 و15.4: "من قائمة محددة").
// مشتقة من أسماء الصفحات في القسمين 24.4 و25. تُعدَّل هنا فقط، وتنعكس على كل المخططات.

export const LANGS = ['en', 'ar'] as const;
export type Lang = (typeof LANGS)[number];

// نوع المنتج
export const PRODUCT_CATEGORIES = [
  'carpet',
  'moquette',
  'zawali',
  'carpet-tiles',
  'red-carpet',
  'mosque-carpet',
] as const;

// المكان (الاستخدام)
export const PLACES = [
  'mosque',
  'musalla',
  'majlis-diwaniya',
  'hallway',
  'stairs',
  'bedroom',
  'living-room',
  'kids',
  'office',
  'hotel',
] as const;

// الخدمة المنفَّذة في المنتج (تربط المنتج بصفحة الخدمة: شبكة نماذج الحفر مثلًا)
export const PRODUCT_SERVICES = ['hand-carving', 'carpet-cutting', 'carpet-installation'] as const;
export const SERVICE_LABELS: Record<(typeof PRODUCT_SERVICES)[number], { ar: string; en: string }> = {
  'hand-carving': { ar: 'حفر يدوي', en: 'Hand carving' },
  'carpet-cutting': { ar: 'قص وحبكة', en: 'Cutting and binding' },
  'carpet-installation': { ar: 'تركيب', en: 'Installation' },
};

// نوع الموقع في المشاريع
export const PROJECT_SITE_TYPES = [
  'mosque',
  'musalla',
  'majlis',
  'diwaniya',
  'home',
  'office',
  'hotel',
  'event',
  'other',
] as const;

// وحدات القياس المسموحة للمواصفات
export const SPEC_UNITS = ['mm', 'cm', 'm', 'ft', 'g/m2', 'kg/m2', 'kg'] as const;

// وحدات البيع (السعر والوحدة معًا أو لا شيء)
export const PRICE_UNITS = ['m2', 'linear-m', 'piece', 'set', 'event'] as const;

export const STATUSES = ['draft', 'published'] as const;

// مناطق الكويت (لـ«من أعمالنا الأخيرة» في المنتج). المصدر الوحيد: src/data/kuwait-areas.json
import areasData from '../data/kuwait-areas.json';
export const KUWAIT_AREAS = areasData.areas.map((a) => a.id) as [string, ...string[]];
export const areaLabel = (id: string, lang: Lang) => {
  const a = areasData.areas.find((x) => x.id === id);
  if (!a) return id;
  const g = (areasData.governorates as Record<string, { ar: string; en: string }>)[a.gov];
  return lang === 'ar' ? `${a.ar}، محافظة ${g.ar}` : `${a.en}, ${g.en} Governorate`;
};

// تسميات العرض للتصنيف والمكان (صفحة المنتج ولوحة الإدارة)
export const CATEGORY_LABELS: Record<(typeof PRODUCT_CATEGORIES)[number], { ar: string; en: string }> = {
  carpet: { ar: 'سجاد', en: 'Carpet' },
  moquette: { ar: 'موكيت', en: 'Wall-to-wall carpet' },
  zawali: { ar: 'زوالي', en: 'Rugs (zawali)' },
  'carpet-tiles': { ar: 'بلاط سجاد', en: 'Carpet tiles' },
  'red-carpet': { ar: 'سجاد المناسبات والريد كاربت', en: 'Red carpet and event carpet' },
  'mosque-carpet': { ar: 'سجاد مساجد', en: 'Mosque carpet' },
};
export const PLACE_LABELS: Record<(typeof PLACES)[number], { ar: string; en: string }> = {
  mosque: { ar: 'المساجد', en: 'Mosques' },
  musalla: { ar: 'المصليات', en: 'Prayer rooms' },
  'majlis-diwaniya': { ar: 'المجالس والديوانيات', en: 'Majlis and diwaniya' },
  hallway: { ar: 'الممرات', en: 'Hallways' },
  stairs: { ar: 'الدرج', en: 'Stairs' },
  bedroom: { ar: 'غرف النوم', en: 'Bedrooms' },
  'living-room': { ar: 'الصالات', en: 'Living rooms' },
  kids: { ar: 'غرف الأطفال', en: 'Kids rooms' },
  office: { ar: 'المكاتب', en: 'Offices' },
  hotel: { ar: 'الفنادق', en: 'Hotels' },
};
export const PRICE_UNIT_LABELS: Record<(typeof PRICE_UNITS)[number], { ar: string; en: string; code: string }> = {
  m2: { ar: 'للمتر المربع', en: 'per m²', code: 'MTK' },
  'linear-m': { ar: 'للمتر الطولي', en: 'per linear metre', code: 'MTR' },
  piece: { ar: 'للقطعة', en: 'per piece', code: 'C62' },
  set: { ar: 'للطقم', en: 'per set', code: 'SET' },
  event: { ar: 'للمناسبة', en: 'per event', code: 'C62' },
};
