// مكتبات تطبيق الفواتير (/invoice/) تُجلب وقت البناء بدل حفظها في المستودع (~620KB مضغوطة مسبقًا).
// كل ملف مثبّت بإصدار و SHA-256 — أي تغيير في المحتوى يوقف البناء. الملفات مطابقة لحزم npm الرسمية.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'public/invoice/vendor');
const LIBS = [
  {
    file: 'html2canvas.min.js',
    pkg: 'html2canvas@1.4.1/dist/html2canvas.min.js',
    sha256: 'e87e550794322e574a1fda0c1549a3c70dae5a93d9113417a429016838eab8cb',
  },
  {
    file: 'jspdf.umd.min.js',
    pkg: 'jspdf@2.5.2/dist/jspdf.umd.min.js',
    sha256: '85ba2cc3ff858a20fa49fe6e457bec863ea40b55a9f3725e58a940e62f6f61a4',
  },
  {
    file: 'qrcode.js',
    pkg: 'qrcode-generator@1.4.4/qrcode.js',
    sha256: '18ae399f81182bc9de916e9c77b195df20cc58d6f2d55a62b085a299f1bf1780',
  },
];
const MIRRORS = ['https://cdn.jsdelivr.net/npm/', 'https://unpkg.com/'];
const hash = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

fs.mkdirSync(OUT, { recursive: true });
for (const lib of LIBS) {
  const dest = path.join(OUT, lib.file);
  if (fs.existsSync(dest) && hash(fs.readFileSync(dest)) === lib.sha256) continue;
  let ok = false;
  for (const base of MIRRORS) {
    try {
      const res = await fetch(base + lib.pkg);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (hash(buf) !== lib.sha256) throw new Error('SHA-256 mismatch');
      fs.writeFileSync(dest, buf);
      ok = true;
      break;
    } catch (e) {
      console.warn(`⚠ ${lib.file} من ${base}: ${e.message}`);
    }
  }
  if (!ok) {
    console.error(`✗ تعذّر جلب ${lib.file} لتطبيق الفواتير`);
    process.exit(1);
  }
}
console.log('✓ مكتبات تطبيق الفواتير جاهزة');
