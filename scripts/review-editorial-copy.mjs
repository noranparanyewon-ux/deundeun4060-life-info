import { mkdir, readFile, writeFile } from "node:fs/promises";

const manifestPath = new URL("../content/article-manifest.json", import.meta.url);
const reportSuffix = process.env.REVIEW_REPORT_SUFFIX ?? "";
const jsonReportPath = new URL(`../content/editorial-llm-review-2026-08-27${reportSuffix}.json`, import.meta.url);
const markdownReportPath = new URL(`../content/editorial-llm-review-2026-08-27${reportSuffix}.md`, import.meta.url);
const apiBase = process.env.BUILT_IN_FORGE_API_URL;
const apiKey = process.env.BUILT_IN_FORGE_API_KEY;

if (!apiBase || !apiKey) throw new Error("Built-in LLM credentials are unavailable.");

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const requestedSlugs = new Set((process.env.REVIEW_SLUGS ?? "").split(",").map((slug) => slug.trim()).filter(Boolean));
const articlesToReview = requestedSlugs.size ? manifest.articles.filter((article) => requestedSlugs.has(article.slug)) : manifest.articles;
if (requestedSlugs.size && articlesToReview.length !== requestedSlugs.size) throw new Error("One or more requested review slugs are missing from the manifest.");
const schema = {
  type: "object",
  properties: {
    verdict: { type: "string", enum: ["approved", "revise"] },
    reasons: { type: "array", minItems: 1, maxItems: 3, items: { type: "string" } },
    issueLocations: { type: "array", minItems: 0, maxItems: 3, items: { type: "string" } },
  },
  required: ["verdict", "reasons", "issueLocations"],
  additionalProperties: false,
};

function reviewPrompt(article) {
  const body = {
    title: article.title,
    excerpt: article.excerpt,
    intro: article.intro,
    sections: article.sections,
    source: article.source,
  };
  return `다음은 한국의 40~60대와 가족을 위한 공공 생활정보 기사입니다. 편집자 관점에서 이 기사 한 편만 검토하세요. 사실을 새로 확인하거나 추가하지 말고, 주어진 문장에서만 판단합니다.\n\n승인 기준: 자연스러운 존댓말, 이해하기 쉬운 문장, 결과를 개인에게 단정하지 않음, 금액·기한·자격을 근거 없이 단정하지 않음, 가짜 경험담·광고·초안 흔적이 없음, 공식 출처 안내와 내용이 충돌하지 않음.\n\n'approved'는 위 기준을 모두 만족할 때만, 'revise'는 실제 독자가 혼동할 만한 문장 문제가 있을 때만 사용합니다. 이유는 구체적이되 최대 3개로 한국어로 작성합니다.\n\n기사:\n${JSON.stringify(body)}`;
}

async function requestReview(article, attempt = 1) {
  const response = await fetch(`${apiBase.replace(/\/$/, "")}/v1/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-5-mini",
      messages: [
        { role: "system", content: "당신은 한국어 공공 생활정보의 신중한 교정 편집자입니다. 출력은 지정 JSON 스키마만 사용합니다." },
        { role: "user", content: reviewPrompt(article) },
      ],
      response_format: { type: "json_schema", json_schema: { name: "editorial_review", strict: true, schema } },
      max_completion_tokens: 700,
    }),
  });
  if (!response.ok) {
    if (attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, attempt * 800));
      return requestReview(article, attempt + 1);
    }
    throw new Error(`Review failed for ${article.slug}: ${response.status} ${await response.text()}`);
  }
  const payload = await response.json();
  return JSON.parse(payload.choices[0].message.content);
}

const results = [];
const batchSize = 4;
for (let start = 0; start < articlesToReview.length; start += batchSize) {
  const batch = articlesToReview.slice(start, start + batchSize);
  const batchResults = await Promise.all(batch.map(async (article) => ({
    slug: article.slug,
    title: article.title,
    publication: article.publication,
    review: await requestReview(article),
  })));
  results.push(...batchResults);
  await mkdir(new URL("../content/", import.meta.url), { recursive: true });
  await writeFile(jsonReportPath, `${JSON.stringify({ model: "gpt-5-mini", reviewedAt: "2026-08-27", results }, null, 2)}\n`, "utf8");
  console.log(`Reviewed ${results.length}/${articlesToReview.length} records.`);
}

const approved = results.filter(({ review }) => review.verdict === "approved");
const revise = results.filter(({ review }) => review.verdict === "revise");
const report = `# 40개 기사 문장 품질 검토\n\n검토일: 2026-08-27  \n검토 모델: gpt-5-mini  \n검토 기준: 자연스러운 존댓말, 독자 혼동 가능성, 과도한 단정, 생성 흔적, 공식 출처 안내와의 문맥 충돌\n\n| 결과 | 건수 |\n|---|---:|\n| 승인 | ${approved.length} |\n| 수정 필요 | ${revise.length} |\n\n## 개별 결과\n\n| 번호 | 기사 | 공개 상태 | 결과 | 편집 판단 |\n|---:|---|---|---|---|\n${results.map(({ title, publication, review }, index) => `| ${index + 1} | ${title} | ${publication === "published" ? "즉시 공개" : "예약"} | ${review.verdict === "approved" ? "승인" : "수정 필요"} | ${review.reasons.join(" / ")} |`).join("\n")}\n\n${revise.length ? `## 수정 필요 항목\n\n${revise.map(({ title, review }) => `- **${title}**: ${review.issueLocations.join(", ") || "본문 전반"} — ${review.reasons.join(" / ")}`).join("\n")}` : "## 결론\n\n40개 글 모두 추가 문장 수정 없이 검토 기준을 통과했습니다."}\n`;
await writeFile(markdownReportPath, report, "utf8");
console.log(`Editorial copy review finished: ${approved.length} approved, ${revise.length} require revision.`);
