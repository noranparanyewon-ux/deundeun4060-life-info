import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { articles, categories, getArticle, getCategory } from "./siteData";

describe("든든한 4060 생활정보 콘텐츠 구조", () => {
  it("uses five named categories and real starter articles without empty reading paths", () => {
    expect(categories.map((category) => category.slug)).toEqual(["welfare", "pension", "health", "saving", "digital"]);
    expect(articles).toHaveLength(5);

    for (const article of articles) {
      expect(getCategory(article.category)).toBeDefined();
      expect(getArticle(article.slug)).toEqual(article);
      expect(article.title.trim()).not.toHaveLength(0);
      expect(article.excerpt.trim()).not.toHaveLength(0);
      expect(article.sections.length).toBeGreaterThan(0);
      expect(article.image).toMatch(/^\/manus-storage\//);
    }
  });

  it("includes a complete mobile quick-menu route set without placeholder anchors", () => {
    const appSource = readFileSync(new URL("../App.tsx", import.meta.url), "utf8");
    const styleSource = readFileSync(new URL("../index.css", import.meta.url), "utf8");
    for (const route of ["/", "/category/welfare", "/category/pension", "/category/health", "/category/saving", "/category/digital", "/about", "/contact", "/privacy", "/disclaimer"]) {
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
});
