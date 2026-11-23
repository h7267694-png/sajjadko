// النشر المجدول (طلب المالك 2026-11-23، قبل سفره شهرين): المنتج الذي له publishDate في المستقبل يبقى مخفيًا
// تمامًا — لا تُبنى صفحته ولا يظهر في القوائم ولا sitemap ولا llms — حتى يحين تاريخه بتوقيت الكويت.
// البناء اليومي (deploy.yml: 00:05 بتوقيت الكويت) يُظهره في يومه دون أي تدخل.
export const todayKuwait = (): string =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kuwait', year: 'numeric', month: '2-digit', day: '2-digit' }).format(
    new Date()
  );

export const isDue = (publishDate?: Date | string) =>
  !publishDate || (typeof publishDate === 'string' ? publishDate : publishDate.toISOString()).slice(0, 10) <= todayKuwait();
