// إعداد لوحة الإدارة (Sveltia CMS) مولَّد وقت البناء من قوائم المخطط نفسها، فلا تختلف اللوحة عن الموقع.
// YAML يقبل JSON، فيُكتب JSON. الصور تُحوَّل WebP وتُصغَّر عند الرفع (ميزانية LCP، 16.1).
import areas from '~/data/kuwait-areas.json';
import { CATEGORY_LABELS, PLACE_LABELS, PRICE_UNIT_LABELS, SPEC_UNITS } from '~/utils/taxonomy';

const opts = (o: Record<string, { ar: string }>) => Object.entries(o).map(([value, l]) => ({ label: l.ar, value }));
const govs = areas.governorates as Record<string, { ar: string }>;
const areaOptions = areas.areas.map((a) => ({ label: `${a.ar} — ${govs[a.gov].ar}`, value: a.id }));
const date = (name: string, label: string, required = true) => ({
  name,
  label,
  widget: 'datetime',
  time_format: false,
  date_format: 'YYYY-MM-DD',
  format: 'YYYY-MM-DD',
  required,
});
const measured = (name: string, label: string) => ({
  name,
  label,
  widget: 'object',
  required: false,
  collapsed: true,
  fields: [
    { name: 'value', label: 'القيمة', widget: 'number', value_type: 'float', required: false },
    { name: 'unit', label: 'الوحدة', widget: 'select', options: [...SPEC_UNITS], required: false },
  ],
});
const text = (en: boolean) => [
  {
    name: 'name',
    label: en ? 'Product name' : 'اسم المنتج',
    widget: 'string',
    maxlength: 70,
    hint: en
      ? 'Max 70 characters'
      : 'حتى 70 حرفًا. اسم رسمي بالنوع والميزة، بلا أسماء مبتكرة ولا مبالغة، مثل: موكيت تركي مخملي بوبر مقصوص بسبعة ألوان',
  },
  {
    name: 'directAnswer',
    label: en ? 'Direct answer (40–80 words)' : 'الإجابة المباشرة (40–80 كلمة)',
    widget: 'text',
    hint: en
      ? 'What it is, who it suits, where it fits, how it is sold and priced.'
      : 'ما هو، لمن، أين يناسب، كيف يُباع وبكم. تظهر أعلى الصفحة وفي وصف جوجل.',
  },
  { name: 'usage', label: en ? 'Where it works' : 'أين يناسب', widget: 'text', required: false },
  { name: 'care', label: en ? 'Care and installation' : 'العناية والتركيب', widget: 'text', required: false },
  {
    name: 'faq',
    label: en ? 'FAQ (3–5)' : 'أسئلة شائعة (3–5)',
    widget: 'list',
    required: false,
    fields: [
      { name: 'q', label: en ? 'Question' : 'السؤال', widget: 'string' },
      { name: 'a', label: en ? 'Answer (30–60 words)' : 'الإجابة (30–60 كلمة)', widget: 'text' },
    ],
  },
  {
    name: 'seoTitle',
    label: en ? 'Google title (≤70)' : 'عنوان جوجل (حتى 70 حرفًا)',
    widget: 'string',
    required: false,
    maxlength: 70,
    hint: en ? 'Ends with | Sajjadko Kuwait' : 'ينتهي بـ « — سجادكو الكويت»',
  },
  {
    name: 'seoDescription',
    label: en ? 'Google description (≤170)' : 'وصف جوجل (حتى 170 حرفًا)',
    widget: 'text',
    required: false,
    maxlength: 170,
  },
  ...(en
    ? [
        {
          name: 'reviewed',
          label: 'تمت مراجعة النص الإنجليزي',
          widget: 'boolean',
          default: false,
          hint: 'الصفحة الإنجليزية لا تُنشر قبل تفعيل هذا الخيار',
        },
      ]
    : []),
];

const config = {
  backend: {
    name: 'github',
    repo: 'h7267694-png/sajjadko',
    branch: 'main',
    commit_messages: {
      create: 'إضافة {{collection}}: {{slug}}',
      update: 'تعديل {{collection}}: {{slug}}',
      delete: 'حذف {{collection}}: {{slug}}',
      uploadMedia: 'رفع صورة: {{path}}',
      deleteMedia: 'حذف صورة: {{path}}',
    },
  },
  site_url: 'https://sajjadko.com',
  display_url: 'https://sajjadko.com',
  media_folder: '/src/assets/uploads',
  public_folder: '/src/assets/uploads',
  media_libraries: {
    default: {
      config: {
        transformations: { raster_image: { format: 'webp', quality: 80, width: 1600, height: 1600 } },
      },
    },
  },
  output: { omit_empty_optional_fields: true },
  collections: [
    {
      name: 'products',
      label: 'المنتجات',
      label_singular: 'منتج',
      description: 'كل منتج صفحة في الموقع /products/الرابط/ . الصور تُحوَّل WebP تلقائيًا.',
      folder: 'src/content/products',
      extension: 'yaml',
      format: 'yaml',
      create: true,
      delete: true,
      identifier_field: 'slug',
      slug: '{{slug}}',
      summary: '{{sku}} · {{slug}} · {{status}}',
      sortable_fields: ['sku', 'slug', 'status'],
      media_folder: '/src/assets/products',
      public_folder: '/src/assets/products',
      fields: [
        {
          name: 'slug',
          label: 'رابط المنتج (إنجليزي)',
          widget: 'string',
          pattern: ['^[a-z0-9]+(-[a-z0-9]+)*$', 'حروف إنجليزية صغيرة وأرقام وشرطات فقط، مثل: remal-plush'],
          hint: 'يظهر في الرابط ولا يُغيَّر بعد النشر.',
        },
        { name: 'sku', label: 'رمز المنتج (SKU)', widget: 'string', hint: 'فريد لكل منتج، مثل SJ-MQ-REMAL' },
        {
          name: 'status',
          label: 'الحالة',
          widget: 'select',
          options: [
            { label: 'مسودة (لا تظهر)', value: 'draft' },
            { label: 'منشور', value: 'published' },
          ],
          default: 'draft',
        },
        { name: 'category', label: 'النوع', widget: 'select', options: opts(CATEGORY_LABELS) },
        {
          name: 'places',
          label: 'الأماكن المناسبة',
          widget: 'select',
          multiple: true,
          min: 1,
          options: opts(PLACE_LABELS),
        },
        {
          name: 'images',
          label: 'الصور',
          label_singular: 'صورة',
          widget: 'list',
          required: false,
          hint: 'الأولى هي الرئيسية. ارفع أي صيغة، وتُحوَّل WebP وتُصغَّر إلى 1600 بكسل تلقائيًا.',
          fields: [
            { name: 'src', label: 'الصورة', widget: 'image' },
            {
              name: 'alt',
              label: 'الوصف البديل',
              widget: 'object',
              fields: [
                {
                  name: 'ar',
                  label: 'عربي',
                  widget: 'string',
                  hint: 'ما في الصورة: النوع واللون والمكان. مثل: موكيت مخملي بيج في غرفة نوم',
                },
                { name: 'en', label: 'English', widget: 'string', required: false },
              ],
            },
            { name: 'original', label: 'صورة أصلية من أعمالنا', widget: 'boolean', default: true },
          ],
        },
        {
          name: 'colors',
          label: 'الألوان',
          widget: 'list',
          required: false,
          hint: 'كل لون في سطر: الرمز ثم الاسم عربي / إنجليزي، مثل: 0004 كريمي / Cream',
        },
        { name: 'sizes', label: 'المقاسات الجاهزة', widget: 'list', required: false, hint: 'مثل: 2 × 3 م' },
        {
          name: 'priceRange',
          label: 'نطاق السعر (اختياري)',
          widget: 'object',
          required: false,
          collapsed: true,
          hint: 'أدنى وأعلى سعر حقيقي، مثل 5 إلى 15 د.ك للمتر المربع. يظهر في جوجل.',
          fields: [
            { name: 'min', label: 'من (د.ك)', widget: 'number', value_type: 'float' },
            { name: 'max', label: 'إلى (د.ك)', widget: 'number', value_type: 'float' },
            { name: 'unit', label: 'الوحدة', widget: 'select', options: opts(PRICE_UNIT_LABELS), default: 'm2' },
            date('updated', 'تاريخ تحديث السعر'),
          ],
        },
        {
          name: 'price',
          label: 'سعر ثابت (اختياري، بدل النطاق)',
          widget: 'object',
          required: false,
          collapsed: true,
          fields: [
            { name: 'amount', label: 'السعر (د.ك)', widget: 'number', value_type: 'float' },
            { name: 'unit', label: 'الوحدة', widget: 'select', options: opts(PRICE_UNIT_LABELS), default: 'm2' },
            date('updated', 'تاريخ تحديث السعر'),
          ],
        },
        {
          name: 'specs',
          label: 'المواصفات',
          widget: 'object',
          required: false,
          collapsed: true,
          hint: 'النص بصيغة: عربي / English',
          fields: [
            {
              name: 'material',
              label: 'الخامة',
              widget: 'string',
              required: false,
              hint: 'مثل: موكيت تركي / Turkish wall-to-wall carpet',
            },
            measured('heightOrThickness', 'الارتفاع أو السماكة'),
            measured('density', 'الكثافة'),
            measured('weight', 'الوزن'),
            measured('width', 'عرض الرول'),
            { name: 'origin', label: 'بلد الصنع', widget: 'string', required: false, hint: 'مثل: تركيا / Turkey' },
            { name: 'installation', label: 'التركيب', widget: 'string', required: false },
            { name: 'careSummary', label: 'العناية باختصار', widget: 'string', required: false },
          ],
        },
        {
          name: 'latestWork',
          label: 'من أعمالنا الأخيرة',
          widget: 'object',
          required: false,
          collapsed: true,
          hint: 'فعّل الخيار وحدد المنطقة ليظهر المنتج في صفحة أعمالنا الأخيرة.',
          fields: [
            { name: 'show', label: 'اعرضه في أعمالنا الأخيرة', widget: 'boolean', default: false },
            { name: 'area', label: 'المنطقة في الكويت', widget: 'select', options: areaOptions, required: false },
            date('date', 'تاريخ التنفيذ', false),
            {
              name: 'note',
              label: 'ملاحظة عن العمل (اختياري)',
              widget: 'object',
              required: false,
              fields: [
                {
                  name: 'ar',
                  label: 'عربي',
                  widget: 'text',
                  required: false,
                  hint: 'مثل: فرش ديوانية 60 م² بلون بيج رملي',
                },
                { name: 'en', label: 'English', widget: 'text', required: false },
              ],
            },
          ],
        },
        { name: 'ar', label: 'النص العربي', widget: 'object', fields: text(false) },
        {
          name: 'en',
          label: 'النص الإنجليزي (اختياري)',
          widget: 'object',
          required: false,
          collapsed: true,
          fields: text(true),
        },
      ],
    },
  ],
};

export const GET = () =>
  new Response(JSON.stringify(config, null, 1), { headers: { 'Content-Type': 'text/yaml; charset=utf-8' } });
