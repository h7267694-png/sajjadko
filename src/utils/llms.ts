// ملفات أدوات الذكاء الاصطناعي (llms.txt): تُولَّد وقت البناء من المحتوى المنشور فقط، فتتحدث مع كل نشر
// ومع كل منتج يُضاف من لوحة الإدارة. الحقائق من site.yaml والصفحات والمنتجات نفسها، لا نص مكرر يدويًا.
import { getCollection } from 'astro:content';
import { getSettings, formatPhone } from '~/utils/site';
import { pageHref } from '~/utils/pages';
import { productHref } from '~/utils/products';
import { CATEGORY_LABELS, PLACE_LABELS, PRICE_UNIT_LABELS } from '~/utils/taxonomy';

const SITE = 'https://sajjadko.com';
const abs = (p: string) => new URL(p, SITE).href;

async function data() {
  const settings = await getSettings();
  const pages = (await getCollection('pages')).filter((p) => p.data.status === 'published' && p.data.kind !== 'home');
  const products = (await getCollection('products')).filter((p) => p.data.status === 'published');
  return { settings, pages, products };
}

const kwd = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(3));
const price = (p: Awaited<ReturnType<typeof data>>['products'][number]) => {
  const d = p.data;
  if (d.price) return `${kwd(d.price.amount)} KWD ${PRICE_UNIT_LABELS[d.price.unit].en}`;
  if (d.priceRange)
    return `${kwd(d.priceRange.min)}–${kwd(d.priceRange.max)} KWD ${PRICE_UNIT_LABELS[d.priceRange.unit].en}`;
  return 'price on request via WhatsApp';
};

function facts(s: Awaited<ReturnType<typeof getSettings>>) {
  const phone = s?.whatsapp ? formatPhone(s.whatsapp) : '';
  return [
    `- Business: ${s?.brand.en ?? 'Sajjadko Kuwait'} (${s?.brand.ar ?? 'سجادكو الكويت'}), a carpet and wall-to-wall carpet store in Kuwait.`,
    `- Address: ${s?.address?.en ?? ''} (${s?.address?.ar ?? ''}).`,
    `- ${s?.hours?.en ?? 'Hours: 8 AM to 8 PM'}.`,
    `- Contact: WhatsApp only, ${phone} (https://wa.me/${s?.whatsapp ?? ''}). No online checkout or payment on the site.`,
    '- Free home visit: a representative visits your home or site in Kuwait to take measurements and show material and colour samples, free of charge.',
    '- Turkish carpet and wall-to-wall carpet: 5–15 KWD per m² depending on thickness, pile pressure and density. Cut to size.',
    '- Lightweight carpet (used for offices and stairs): from 1.250 to 3 KWD per m². Office carpet tiles (nylon and polypropylene): 5–6 KWD per m².',
    '- Mosque and prayer room carpet: 6 / 7 / 8 KWD per m² (light / medium / thick), rolls 1.33 m or 4 m wide, rows aligned with the qibla.',
    '- Red carpet rental: 1 KWD per m² outdoor, 0.750 KWD per m² indoor, delivery, laying and removal included.',
    '- Installation: priced separately by area and location; two days of follow-up after installation; only carpet supplied by us is installed; can be scheduled outside working hours.',
    '- Not sold: Persian/Iranian rugs, individual prayer mats, doormats.',
    '- Languages: Arabic and English. Area served: all of Kuwait.',
  ].join('\n');
}

export async function llmsTxt() {
  const { settings, pages, products } = await data();
  const pageLines = pages
    .sort((a, b) => a.data.lang.localeCompare(b.data.lang) || a.data.urlPath.localeCompare(b.data.urlPath))
    .map(
      (p) => `- [${p.data.h1}](${abs(pageHref(p.data.lang, p.data.urlPath))}) (${p.data.lang}): ${p.data.description}`
    );
  const productLines = products.flatMap((p) => {
    const out: string[] = [];
    if (p.data.en?.reviewed)
      out.push(
        `- [${p.data.en.name}](${abs(productHref('en', p.id))}) — ${CATEGORY_LABELS[p.data.category].en}; ${price(p)}; suits ${p.data.places.map((x) => PLACE_LABELS[x].en.toLowerCase()).join(', ')}.`
      );
    if (p.data.ar) out.push(`- [${p.data.ar.name}](${abs(productHref('ar', p.id))}) (ar)`);
    return out;
  });
  return `# ${settings?.brand.en ?? 'Sajjadko Kuwait'} | ${settings?.brand.ar ?? 'سجادكو الكويت'}

> Carpet store in Al Dajeej, Kuwait: Turkish carpet, wall-to-wall carpet (moquette), hallway and stair runners, office and mosque carpet, sold by the square metre, cut to size and installed. Free home visit to measure and show samples. Orders via WhatsApp. Bilingual site (English at /, Arabic at /ar/).

## Key facts
${facts(settings)}

## Home
- [Home (English)](${abs('/')})
- [الرئيسية (Arabic)](${abs('/ar/')})

## Pages
${pageLines.join('\n')}

## Products
${productLines.join('\n')}

## More
- [Full text for AI tools](${abs('/llms-full.txt')}): every published page and product with direct answers and FAQs.
- [Sitemap](${abs('/sitemap-index.xml')})
`;
}

export async function llmsFullTxt() {
  const { settings, pages, products } = await data();
  const parts: string[] = [
    `# ${settings?.brand.en ?? 'Sajjadko Kuwait'} | ${settings?.brand.ar ?? 'سجادكو الكويت'}: full content for AI tools`,
    '',
    'Generated at build time from published pages and products only. Prices are in Kuwaiti dinars (KWD).',
    '',
    '## Key facts',
    facts(settings),
  ];
  for (const p of pages) {
    const d = p.data;
    parts.push(
      '',
      `## ${d.h1}`,
      `URL: ${abs(pageHref(d.lang, d.urlPath))} | Language: ${d.lang}${d.updated ? ` | Updated: ${d.updated.toISOString().slice(0, 10)}` : ''}`,
      '',
      d.directAnswer,
      ...(d.faq.length ? ['', '### FAQ', ...d.faq.map((f) => `Q: ${f.q}\nA: ${f.a}`)] : [])
    );
  }
  for (const p of products) {
    for (const lang of ['en', 'ar'] as const) {
      const tx = p.data[lang];
      if (!tx || (lang === 'en' && !tx.reviewed)) continue;
      parts.push(
        '',
        `## ${tx.name}`,
        `URL: ${abs(productHref(lang, p.id))} | SKU: ${p.data.sku} | Language: ${lang} | Price: ${price(p)}`,
        '',
        tx.directAnswer,
        ...(tx.usage ? ['', tx.usage] : []),
        ...(tx.faq.length ? ['', '### FAQ', ...tx.faq.map((f) => `Q: ${f.q}\nA: ${f.a}`)] : [])
      );
    }
  }
  return parts.join('\n') + '\n';
}
