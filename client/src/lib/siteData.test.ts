import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { articles, categories, getArticle, getCategory, getLegacyDigitalArticle, withSiteBasePath } from "./siteData";

const manifest = JSON.parse(readFileSync(new URL("../../../content/article-manifest.json", import.meta.url), "utf8"));
const projectRoot = fileURLToPath(new URL("../../../", import.meta.url));

describe("든든한 4060 생활정보 콘텐츠 구조", () => {
  it("uses four focused categories and exposes only the 12 reviewed launch articles", () => {
    expect(categories.map((category) => category.slug)).toEqual(["welfare", "pension", "health", "saving"]);
    expect(articles).toHaveLength(12);
    const imageBasePath = import.meta.env.BASE_URL.replace(/\/?$/, "/");

    for (const article of articles) {
      expect(getCategory(article.category)).toBeDefined();
      expect(getArticle(article.slug)).toEqual(article);
      expect(article.title.trim()).not.toHaveLength(0);
      expect(article.excerpt.trim()).not.toHaveLength(0);
      expect(article.sections.length).toBeGreaterThan(0);
      expect(article.image.startsWith(`${imageBasePath}editorial/`)).toBe(true);
      const relativeImagePath = article.image.slice(imageBasePath.length);
      expect(relativeImagePath).toMatch(/^editorial\/[a-z0-9-]+\.svg$/);
      expect(article.imageAlt.trim()).not.toHaveLength(0);
      expect(existsSync(new URL(`../../public/${relativeImagePath}`, import.meta.url))).toBe(true);
      expect(article.canonicalPath).toBe(`/${article.category}/${article.slug}`);
      expect(article.source.href).toMatch(/^https?:\/\//);
      expect(article.verification.status).toBe("official-source-reviewed");
    }
  });

  it("keeps the 28 future records out of the browser payload and records Korea-time release slots in UTC", () => {
    const published = manifest.articles.filter((article: { publication: string }) => article.publication === "published");
    const scheduled = manifest.articles.filter((article: { publication: string }) => article.publication === "scheduled");
    expect(manifest.articles).toHaveLength(40);
    expect(published).toHaveLength(12);
    expect(scheduled).toHaveLength(28);
    expect(scheduled.every((article: { publishedAt: string }) => /T(00|09):00:00\.000Z$/.test(article.publishedAt))).toBe(true);
    expect(scheduled.some((article: { slug: string }) => articles.some((publicArticle) => publicArticle.slug === article.slug))).toBe(false);
  });

  it("retains official-source metadata and removes draft-generation traces from all 40 records", () => {
    const serialized = JSON.stringify(manifest);
    expect(serialized).not.toMatch(/utm_|\]\(https?:\/\/|공식 원문 확인 필요|초안|첫 문단:|둘째 문단:|도입부:|제목:\s*.+카테고리:/);
    for (const article of manifest.articles) {
      expect(article.canonicalPath).toBe(`/${article.category}/${article.slug}`);
      expect(article.reviewedAt).toBe("2026-08-27");
      expect(article.verification.status).toBe("official-source-reviewed");
      expect(article.sources).toHaveLength(1);
      expect(article.sources[0].kind).toBe("official-primary");
      expect(article.sources[0].href).toMatch(/^https?:\/\//);
    }
  });

  it("generates a sitemap from published canonical URLs only", () => {
    execFileSync(process.execPath, ["scripts/generate-seo.mjs"], {
      cwd: projectRoot,
      env: {
        ...process.env,
        PUBLISH_NOW: "2026-08-27T00:00:00.000Z",
        SITE_URL: "https://example.test",
      },
    });
    const sitemap = readFileSync(new URL("../../../client/public/sitemap.xml", import.meta.url), "utf8");
    expect((sitemap.match(/<loc>/g) ?? [])).toHaveLength(21);
    expect(sitemap).toContain("https://example.test/welfare/basic-livelihood-living-allowance");
    expect(sitemap).not.toContain("/welfare/emergency-welfare-support-system");
    expect(sitemap).not.toContain("/category/digital");
    expect(sitemap).not.toContain("<priority>");
    expect(sitemap).not.toContain("<changefreq>");
  });

  it("preserves the previous digital guide outside the primary content and crawler payload", () => {
    const legacyDigital = getLegacyDigitalArticle("smartphone-security-checklist");
    expect(legacyDigital?.canonicalPath).toBe("/archive/digital/smartphone-security-checklist");
    expect(articles.some((article) => article.slug === legacyDigital?.slug)).toBe(false);
    const appSource = readFileSync(new URL("../App.tsx", import.meta.url), "utf8");
    expect(appSource).toContain('path="/archive/digital/:slug"');
  });

  it("includes a complete mobile quick-menu route set without placeholder anchors", () => {
    const appSource = readFileSync(new URL("../App.tsx", import.meta.url), "utf8");
    const styleSource = readFileSync(new URL("../index.css", import.meta.url), "utf8");
    for (const route of ["/", "/category/welfare", "/category/pension", "/category/health", "/category/saving", "/about", "/contact", "/privacy", "/disclaimer"]) {
      expect(appSource).toContain(`href="${route}"`);
    }
    expect(appSource).toContain("mobile-menu-panel");
    expect(appSource).toContain('setMenuOpen((open) => !open)');
    expect(appSource).toContain('const closeMenu = () => setMenuOpen(false)');
    expect(appSource).toContain('document.body.classList.toggle("mobile-menu-open", menuOpen)');
    expect(styleSource).toContain("body.mobile-menu-open { overflow: hidden; }");
    expect(styleSource).toContain(".main-nav--open { opacity: 1; pointer-events: auto;");
    expect(appSource).not.toContain('href="#"');
  });

  it("ships a four-category feature slider with button, keyboard, and touch paths", () => {
    const homeSource = readFileSync(new URL("../pages/Home.tsx", import.meta.url), "utf8");
    expect(homeSource).toContain("const featureStories = [featured, pension, health, saving, articles[1] ?? featured]");
    expect(homeSource).not.toContain('category === "digital"');
    expect(homeSource).toContain('aria-roledescription="carousel"');
    expect(homeSource).toContain('onTouchStart=');
    expect(homeSource).toContain('event.key === "ArrowLeft"');
    expect(homeSource).toContain('event.key === "ArrowRight"');
    expect(homeSource).toContain('aria-label="이전 특집 기사"');
    expect(homeSource).toContain('aria-label="다음 특집 기사"');
  });

  it("ships GitHub Pages routing and deployment without Cloudflare deployment secrets", () => {
    const workflow = readFileSync(new URL("../../../.github/workflows/publish-scheduled-content.yml", import.meta.url), "utf8");
    const viteConfig = readFileSync(new URL("../../../vite.config.ts", import.meta.url), "utf8");
    const mainSource = readFileSync(new URL("../main.tsx", import.meta.url), "utf8");
    const fallback = readFileSync(new URL("../../public/404.html", import.meta.url), "utf8");
    expect(workflow).toContain("actions/deploy-pages@v4");
    expect(workflow).toContain("actions/upload-pages-artifact@v3");
    expect(workflow).not.toContain("cloudflare/wrangler-action");
    expect(workflow).not.toContain("CLOUDFLARE_API_TOKEN");
    expect(viteConfig).toContain("process.env.VITE_BASE_PATH || \"/\"");
    expect(mainSource).toContain("<Router base={routerBase}>");
    expect(fallback).toContain("deundeun4060-life-info");
  });

  it("uses base-path-safe editorial images without project-only storage paths", () => {
    const imageBasePath = import.meta.env.BASE_URL.replace(/\/?$/, "/");
    expect(JSON.stringify(articles)).not.toContain("/manus-storage/");
    expect(articles.every((article) => article.image.startsWith(`${imageBasePath}editorial/`))).toBe(true);
    expect(withSiteBasePath("editorial/example.svg", "/deundeun4060-life-info/")).toBe("/deundeun4060-life-info/editorial/example.svg");
    expect(withSiteBasePath("/editorial/example.svg", "/")).toBe("/editorial/example.svg");
    const legacySource = readFileSync(new URL("./siteData.ts", import.meta.url), "utf8");
    expect(legacySource).not.toContain("/manus-storage/");
  });
});
