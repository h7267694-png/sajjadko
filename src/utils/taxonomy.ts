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
