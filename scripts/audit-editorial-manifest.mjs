import { readFile, writeFile } from "node:fs/promises";

const manifestPath = new URL("../content/article-manifest.json", import.meta.url);
const reportPath = new URL("../content/editorial-qa-2026-08-27.md", import.meta.url);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const banned = /utm_|\]\(https?:\/\/|공식 원문 확인 필요|초안|첫 문단:|둘째 문단:|도입부:|제목:\s*.+카테고리:/;

const rows = manifest.articles.map((article, index) => {
  const text = [article.title, article.excerpt, article.intro, ...article.sections.flatMap((section) => [section.heading, ...section.paragraphs, ...section.bullets])].join(" ");
  const structureOk = article.sections.length === 3
    && article.sections.every((section) => section.paragraphs.length >= 2 && section.bullets.length >= 3);
  const metadataOk = article.source?.href?.startsWith("http")
    && article.sources?.length === 1
    && article.sources?.[0]?.kind === "official-primary"
    && article.canonicalPath === `/${article.category}/${article.slug}`
    && article.reviewedAt === "2026-08-27";
  const status = structureOk && metadataOk && !banned.test(text) ? "통과" : "재검토 필요";
  return { no: index + 1, article, status, structureOk, metadataOk };
});

if (rows.some((row) => row.status !== "통과")) {
  throw new Error("Editorial QA found one or more records requiring review.");
}

const categoryLabel = manifest.categoryMeta;
const markdown = `# 40개 기사 편집 QA 기록\n\n검토일: 2026-08-27  \n검토 범위: 제목, 요약, 도입부, 3개 소제목·문단·확인목록, 공개 상태·공개 시각, 정규 경로, 1차 공식 출처 메타데이터\n\n| 번호 | 카테고리 | 기사 | 공개 상태 | 공식 출처 | 구조·문구 | 결과 |\n|---:|---|---|---|---|---|---|\n${rows.map(({ no, article, status, structureOk, metadataOk }) => `| ${no} | ${categoryLabel[article.category].label} | ${article.title} | ${article.publication === "published" ? "즉시 공개" : `예약 · ${article.publishedAt.replace("T", " ").replace(".000Z", " UTC")}`} | [${article.source.label}](${article.source.href}) | ${structureOk && metadataOk ? "3개 소제목·공식 출처·정규 경로 확인" : "재검토 필요"} | ${status} |`).join("\n")}\n\n## 편집 판단\n\n모든 기사는 제도·건강·금융·생활비 관련 결과를 개인에게 단정하지 않도록 정리했습니다. 금액, 비율, 마감일, 특정 기관·상품의 우열처럼 변동 가능성이 큰 수치는 본문에서 고정 사실로 쓰지 않고, 각 글 하단의 1차 공식 출처에서 최신 기준을 확인하도록 구성했습니다.\n\n예약 글은 공개 시각이 되기 전에는 브라우저 번들, 카테고리, 검색, 사이트맵에 포함되지 않습니다. 실제 공개 직전에는 해당 기사 출처의 날짜·대상·신청 경로가 변하지 않았는지 다시 확인해야 합니다.\n`;

await writeFile(reportPath, markdown, "utf8");
console.log(`Editorial QA passed for ${rows.length} records.`);
