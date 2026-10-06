// قواعد الفهرسة التلقائية للمنتج (خطة 14.5 و15.5): بلا رمز أو بلا 5 مواصفات أو بلا صورة أصلية => noindex.
type ProductData = {
  sku?: string;
  specs: Record<string, unknown>;
  images: { original?: boolean }[];
};

export const countSpecs = (specs: Record<string, unknown>) =>
  Object.values(specs).filter((v) => v !== undefined && v !== null && v !== '').length;

export const isProductIndexable = (p: ProductData) =>
  Boolean(p.sku) && countSpecs(p.specs) >= 5 && p.images.some((i) => i.original !== false);
