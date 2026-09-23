// Traite une image validée : WebP, 1200 x 630, < 150 Ko, nom SEO, dans public/images/blog/.
// Usage : node scripts/redaction/image.mjs <url-ou-fichier> <nom-seo-sans-extension>
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const [src, name] = process.argv.slice(2);
if (!src || !name || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) {
  console.error("Usage : node scripts/redaction/image.mjs <url-ou-fichier> <nom-minuscules-tirets>");
  process.exit(1);
}

const input = /^https?:\/\//.test(src)
  ? Buffer.from(await (await fetch(src)).arrayBuffer())
  : await readFile(src);

const out = path.join("public", "images", "blog", `${name}.webp`);
const MAX = 150 * 1024;
let buf;
for (let quality = 82; quality >= 40; quality -= 6) {
  buf = await sharp(input)
    .resize(1200, 630, { fit: "cover", position: "attention" })
    .webp({ quality, effort: 6 })
    .toBuffer();
  if (buf.length < MAX) break;
}
if (buf.length >= MAX) {
  console.error(`Impossible de descendre sous 150 Ko (${Math.round(buf.length / 1024)} Ko)`);
  process.exit(1);
}
await writeFile(out, buf);
const meta = await sharp(buf).metadata();
console.log(`${out} : ${meta.width} x ${meta.height}, ${Math.round(buf.length / 1024)} Ko`);
