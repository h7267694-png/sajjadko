import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { WA_TYPES } from './utils/whatsapp';

const metadataDefinition = () =>
  z
    .object({
      title: z.string().optional(),
      ignoreTitleTemplate: z.boolean().optional(),

      canonical: z.url().optional(),

      robots: z
        .object({
          index: z.boolean().optional(),
          follow: z.boolean().optional(),
        })
        .optional(),

      description: z.string().optional(),

      openGraph: z
        .object({
          url: z.string().optional(),
          siteName: z.string().optional(),
          images: z
            .array(
              z.object({
                url: z.string(),
                width: z.number().optional(),
                height: z.number().optional(),
              })
            )
            .optional(),
          locale: z.string().optional(),
          type: z.string().optional(),
        })
        .optional(),

      twitter: z
        .object({
          handle: z.string().optional(),
          site: z.string().optional(),
          cardType: z.string().optional(),
        })
        .optional(),
    })
    .optional();

const postCollection = defineCollection({
  loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/data/post' }),
  schema: z.object({
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),
    draft: z.boolean().optional(),

    title: z.string(),
    excerpt: z.string().optional(),
    image: z.string().optional(),
    /** Alternative text for the cover image. Leave empty for decorative stock photos. */
    imageAlt: z.string().optional(),

    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),

    metadata: metadataDefinition(),
  }),
});

// ───────────────────────── مجموعات سجادكو (الخطة 14.5 و15.4 و24.5) ─────────────────────────
import {
  LANGS,
  PRODUCT_CATEGORIES,
  PLACES,
  PROJECT_SITE_TYPES,
  SPEC_UNITS,
  PRICE_UNITS,
  STATUSES,
  KUWAIT_AREAS,
} from './utils/taxonomy';

const status = z.enum(STATUSES).default('draft');

const faq = z.object({ q: z.string().min(5), a: z.string().min(10) });

const measured = z.object({ value: z.number().positive(), unit: z.enum(SPEC_UNITS) });

const seo = {
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(170).optional(),
};

// ── المنتجات: ملف واحد لكل منتج. الحقول الثابتة مشتركة، والنصوص داخل كتلتي en وar (24.5: الثابت من مصدر واحد)
const productText = z.object({
  name: z.string().min(2).max(70), // 15.4: لا يتجاوز 70 حرفًا
  directAnswer: z.string().min(20),
  usage: z.string().optional(),
  care: z.string().optional(),
  faq: z.array(faq).default([]),
  reviewed: z.boolean().default(false), // 24.3 و26.2 بند 39
  ...seo,
});

const productsCollection = defineCollection({
  loader: glob({ pattern: '*.{yaml,yml,json}', base: 'src/content/products' }),
  schema: ({ image }) =>
    z
      .object({
        // رابط المنتج /products/<slug>/ (محمّل glob يجعله معرّف المدخل). حروف إنجليزية صغيرة وأرقام وشرطات
        slug: z
          .string()
          .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'الرابط: حروف إنجليزية صغيرة وأرقام وشرطات فقط')
          .optional(),
        sku: z.string().min(2), // التفرد بين الملفات يفحصه حاجز الجودة لاحقًا
        status,
        category: z.enum(PRODUCT_CATEGORIES),
        places: z.array(z.enum(PLACES)).min(1),
        specs: z
          .object({
            material: z.string().optional(),
            heightOrThickness: measured.optional(),
            density: measured.optional(),
            weight: measured.optional(),
            width: measured.optional(),
            origin: z.string().optional(),
            installation: z.string().optional(),
            careSummary: z.string().optional(),
          })
          .default({}),
        sizes: z.array(z.string()).default([]),
        colors: z.array(z.string()).default([]),
        images: z
          .array(
            z.object({
              src: image(),
              original: z.boolean().default(true), // صورة أصلية لا مخزون
              alt: z.object({ en: z.string().min(3).optional(), ar: z.string().min(3).optional() }),
            })
          )
          .default([]),
        // 15.4: السعر + الوحدة + تاريخ التحديث معًا أو لا شيء
        price: z
          .object({
            amount: z.number().positive(),
            unit: z.enum(PRICE_UNITS),
            updated: z.coerce.date(),
          })
          .optional(),
        // نطاق سعر حقيقي (مثل 5–15 د.ك للمتر المربع). يولّد AggregateOffer في Schema
        priceRange: z
          .object({
            min: z.number().positive(),
            max: z.number().positive(),
            unit: z.enum(PRICE_UNITS),
            updated: z.coerce.date(),
          })
          .refine((r) => r.max >= r.min, { message: 'الحد الأعلى أقل من الأدنى' })
          .optional(),
        // «من أعمالنا الأخيرة»: يظهر المنتج في صفحة الأعمال مع المنطقة والتاريخ
        latestWork: z
          .object({
            show: z.boolean().default(false),
            area: z.enum(KUWAIT_AREAS).optional(),
            date: z.coerce.date().optional(),
            note: z.object({ ar: z.string().optional(), en: z.string().optional() }).default({}),
          })
          .refine((w) => !w.show || w.area, { message: 'حدد المنطقة لعرضه في أعمالنا الأخيرة', path: ['area'] })
          .optional(),
        en: productText.optional(),
        ar: productText.optional(),
      })
      .superRefine((p, ctx) => {
        if (!p.en && !p.ar) ctx.addIssue({ code: 'custom', message: 'يلزم نص بلغة واحدة على الأقل (en أو ar)' });
        // 15.5: الوصف البديل العربي إلزامي لكل صورة. الإنجليزي يُستكمل من اسم المنتج عند غيابه،
        // والنص الإنجليزي غير المراجَع لا تُبنى صفحته (24.5) بدل أن يفشل البناء عند الإضافة من لوحة الإدارة.
        if (p.ar)
          p.images.forEach((img, i) => {
            if (!img.alt.ar)
              ctx.addIssue({ code: 'custom', path: ['images', i, 'alt', 'ar'], message: 'الوصف البديل العربي إلزامي' });
          });
      }),
});

// ── المشاريع (6.4): 6 صور أصلية وموافقة نشر ومساحة وخامة حقيقيتان قبل النشر
const projectText = z.object({
  title: z.string().min(5).max(110),
  summary: z.string().min(20),
  challenge: z.string().optional(),
  result: z.string().optional(),
  reviewed: z.boolean().default(false),
  ...seo,
});

const projectsCollection = defineCollection({
  loader: glob({ pattern: '*.{yaml,yml,json}', base: 'src/content/projects' }),
  schema: ({ image }) =>
    z
      .object({
        status,
        siteType: z.enum(PROJECT_SITE_TYPES),
        area: z.string().optional(), // المنطقة: اختيارية بموافقة العميل (6.4)
        areaSqm: z.number().positive().optional(),
        material: z.string().optional(),
        works: z.array(z.string()).default([]), // ما نُفذ: قص، تركيب...
        completedOn: z.coerce.date().optional(),
        publishApproval: z.boolean().default(false), // موافقة النشر
        relatedService: z.string().optional(),
        relatedProduct: z.string().optional(),
        images: z
          .array(
            z.object({
              src: image(),
              stage: z.enum(['before', 'measure', 'material', 'cut', 'install', 'result']).optional(),
              alt: z.object({ en: z.string().min(3).optional(), ar: z.string().min(3).optional() }),
            })
          )
          .default([]),
        en: projectText.optional(),
        ar: projectText.optional(),
      })
      .superRefine((p, ctx) => {
        if (!p.en && !p.ar) ctx.addIssue({ code: 'custom', message: 'يلزم نص بلغة واحدة على الأقل (en أو ar)' });
        for (const lang of LANGS) {
          if (!p[lang]) continue;
          p.images.forEach((img, i) => {
            if (!img.alt[lang])
              ctx.addIssue({
                code: 'custom',
                path: ['images', i, 'alt', lang],
                message: `الوصف البديل (${lang}) إلزامي`,
              });
          });
        }
        if (p.status === 'published') {
          if (!p.publishApproval)
            ctx.addIssue({ code: 'custom', path: ['publishApproval'], message: 'النشر يتطلب موافقة العميل' });
          if (p.images.length < 6) ctx.addIssue({ code: 'custom', path: ['images'], message: 'يلزم 6 صور أصلية' });
          if (!p.areaSqm) ctx.addIssue({ code: 'custom', path: ['areaSqm'], message: 'المساحة إلزامية' });
          if (!p.material) ctx.addIssue({ code: 'custom', path: ['material'], message: 'الخامة إلزامية' });
          if (p.en && !p.en.reviewed)
            ctx.addIssue({ code: 'custom', path: ['en', 'reviewed'], message: 'يتطلب reviewed: true' });
        }
      }),
});

// ── صفحات Markdown لكل لغة (الخدمات والأدلة والصفحات): translationKey يربط الزوج (24.5)
const pageFields = {
  lang: z.enum(LANGS),
  translationKey: z.string().min(2),
  // الرابط المجمَّد من 4.1 (لا يُسمّى slug: محمّل glob يستخدم slug معرّفًا فيتصادم الزوجان) بلا بادئة اللغة وبلا شرطات طرفية، مثل: mosque-carpets/musalla
  urlPath: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/, 'حروف إنجليزية صغيرة وأرقام وشرطات فقط'),
  status,
  title: z.string().min(5).max(70), // العنوان الوصفي
  description: z.string().min(50).max(170),
  h1: z.string().min(3),
  directAnswer: z.string().min(20),
  faq: z.array(faq).default([]),
  reviewed: z.boolean().default(false),
  noTranslation: z.boolean().default(false), // [EN فقط] / [AR فقط]
  updated: z.coerce.date().optional(),
};

type RuleFields = { status: string; lang: string; reviewed: boolean; faq: unknown[] };
const withRules = <T extends z.ZodType<RuleFields>>(schema: T, minFaq: number) =>
  schema.superRefine((p: RuleFields, ctx) => {
    if (p.status !== 'published') return;
    if (p.lang === 'en' && !p.reviewed)
      ctx.addIssue({ code: 'custom', path: ['reviewed'], message: 'صفحة إنجليزية منشورة تتطلب reviewed: true' });
    if (p.faq.length < minFaq)
      ctx.addIssue({ code: 'custom', path: ['faq'], message: `الحد الأدنى للأسئلة الشائعة ${minFaq}` });
  });

const servicesCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/services' }),
  schema: withRules(z.object({ ...pageFields }), 6), // 6.2: 6–8 أسئلة
});

const guidesCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/guides' }),
  schema: withRules(
    z.object({
      ...pageFields,
      published: z.coerce.date(), // 6.5: تاريخ النشر والتحديث إلزاميان
      updated: z.coerce.date(),
      author: z.string().default('Sajjadko Kuwait'),
      mainCommercialPage: z.string().min(2), // translationKey للصفحة التجارية الرئيسية المرتبطة
    }),
    4 // 6.5: 4–6 أسئلة
  ),
});

const pagesCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/pages' }),
  schema: withRules(
    z.object({
      ...pageFields,
      kind: z.enum(['home', 'category', 'opportunity', 'local', 'faq', 'about', 'contact', 'service']),
      parent: z.string().optional(), // translationKey للأب الأعلى
      waType: z.enum(WA_TYPES).optional(), // نوع رسالة واتساب (7.2). الافتراضي: category
      // شبكة النماذج (6.1 بند 5): تعرض المنتجات المطابقة للتصنيف أو المكان
      productGrid: z
        .object({
          categories: z.array(z.enum(PRODUCT_CATEGORIES)).optional(),
          places: z.array(z.enum(PLACES)).optional(),
        })
        .optional(),
    }),
    5 // 6.1: 5 أسئلة على الأقل
  ),
});

// ── الإعدادات: ملف واحد (رقم واتساب، العنوان، الساعات، الروابط)
const settingsCollection = defineCollection({
  loader: glob({ pattern: 'site.yaml', base: 'src/content/settings' }),
  schema: z.object({
    brand: z.object({ en: z.string(), ar: z.string() }),
    whatsapp: z
      .string()
      .regex(/^\d{8,15}$/, 'أرقام فقط بصيغة دولية بلا + (مثال: 965XXXXXXXX)')
      .optional(),
    address: z.object({ en: z.string().optional(), ar: z.string().optional() }).optional(),
    hours: z.object({ en: z.string().optional(), ar: z.string().optional() }).optional(),
    social: z.object({ instagram: z.url().optional() }).optional(),
  }),
});

export const collections = {
  post: postCollection,
  products: productsCollection,
  projects: projectsCollection,
  services: servicesCollection,
  guides: guidesCollection,
  pages: pagesCollection,
  settings: settingsCollection,
};
