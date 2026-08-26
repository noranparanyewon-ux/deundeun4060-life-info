import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(scriptDir, "..", "client", "public");
const manifestPath = path.resolve(scriptDir, "..", "content", "article-manifest.json");
const rawSiteUrl = process.env.SITE_URL || "https://deundeun4060-life-info.manus.space";
const siteUrl = rawSiteUrl.replace(/\/+$/, "");
const now = new Date(process.env.PUBLISH_NOW || new Date().toISOString());
const staticLastmod = process.env.SITE_UPDATED_AT || "2026-08-27";

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const staticRoutes = ["/", "/category/welfare", "/category/pension", "/category/health", "/category/saving", "/about", "/contact", "/privacy", "/disclaimer"];
const publishedArticles = manifest.articles.filter((article) => article.publishedAt && new Date(article.publishedAt) <= now);
const routes = [
  ...staticRoutes.map((route) => ({ route, lastmod: staticLastmod })),
  ...publishedArticles.map((article) => ({ route: article.canonicalPath, lastmod: article.reviewedAt })),
];

const robots = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
const sitemapItems = routes.map(({ route, lastmod }) => `  <url><loc>${siteUrl}${route}</loc><lastmod>${lastmod}</lastmod></url>`).join("\n");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapItems}\n</urlset>\n`;

await mkdir(publicDir, { recursive: true });
await Promise.all([
  writeFile(path.join(publicDir, "robots.txt"), robots, "utf8"),
  writeFile(path.join(publicDir, "sitemap.xml"), sitemap, "utf8"),
]);

console.log(`SEO files generated for ${siteUrl} with ${publishedArticles.length} published articles.`);
