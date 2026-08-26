import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(scriptDir, "..", "client", "public");
const rawSiteUrl = process.env.SITE_URL || "https://deundeun4060-life-info.manus.space";
const siteUrl = rawSiteUrl.replace(/\/+$/, "");

const routes = [
  ["/", "weekly", "1.0"],
  ["/category/welfare", "weekly", "0.8"],
  ["/category/pension", "weekly", "0.8"],
  ["/category/health", "weekly", "0.8"],
  ["/category/saving", "weekly", "0.8"],
  ["/category/digital", "weekly", "0.8"],
  ["/article/government-benefit-search-first-steps", "monthly", "0.8"],
  ["/article/smartphone-security-checklist", "monthly", "0.7"],
  ["/article/health-checkup-appointment-prep", "monthly", "0.7"],
  ["/article/monthly-fixed-cost-review", "monthly", "0.7"],
  ["/article/pension-preparation-conversation", "monthly", "0.7"],
  ["/about", "yearly", "0.4"],
  ["/contact", "yearly", "0.3"],
  ["/privacy", "yearly", "0.2"],
  ["/disclaimer", "yearly", "0.2"],
];

const robots = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
const sitemapItems = routes.map(([route, frequency, priority]) => `  <url><loc>${siteUrl}${route}</loc><changefreq>${frequency}</changefreq><priority>${priority}</priority></url>`).join("\n");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapItems}\n</urlset>\n`;

await mkdir(publicDir, { recursive: true });
await Promise.all([
  writeFile(path.join(publicDir, "robots.txt"), robots, "utf8"),
  writeFile(path.join(publicDir, "sitemap.xml"), sitemap, "utf8"),
]);

console.log(`SEO files generated for ${siteUrl}`);
