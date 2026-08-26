import { mkdir, writeFile } from "node:fs/promises";

const apiBase = process.env.BUILT_IN_FORGE_API_URL;
const apiKey = process.env.BUILT_IN_FORGE_API_KEY;
if (!apiBase || !apiKey) throw new Error("Built-in LLM credentials are unavailable.");

const sourceByCategory = {
  welfare: { label: "복지로·보건복지부", href: "https://www.bokjiro.go.kr/" },
  pension: { label: "국민연금공단", href: "https://www.nps.or.kr/" },
  health: { label: "국민건강보험공단", href: "https://www.nhis.or.kr/" },
  saving: { label: "정부24·관련 공공기관", href: "https://www.gov.kr/" },
};

const catalog = {
  welfare: [
    ["basic-livelihood-living-allowance", "기초생활수급자 생계급여 신청 자격과 소득인정액 확인 순서"],
    ["senior-customized-care-service", "노인맞춤돌봄서비스 신청 대상과 이용 전 확인할 사항"],
    ["near-poverty-class-benefits", "차상위계층 확인서 발급 기준과 공공요금 감면 확인 방법"],
    ["emergency-welfare-support-system", "긴급복지지원제도 위기 사유와 신청 전 준비할 정보"],
    ["single-parent-family-child-support", "한부모가족과 조손가정의 아동양육비 지원 확인 방법"],
    ["disability-pension-allowance-criteria", "장애인연금과 장애수당 대상 확인을 위한 기본 기준"],
    ["veterans-national-merit-benefits", "국가유공자와 보훈대상자 지원을 확인하는 순서"],
    ["housing-allowance-repair-grant", "주거급여와 자가가구 수선유지급여 신청 전 체크할 항목"],
    ["catastrophic-health-expenditure-support", "재난적의료비 지원 대상과 의료비 부담 확인 순서"],
    ["subsidy24-customized-welfare-lookup", "보조금24로 나에게 맞는 복지서비스를 찾는 방법"],
  ],
  pension: [
    ["early-vs-delayed-national-pension", "국민연금 조기노령연금과 연기연금, 비교 전에 확인할 기준"],
    ["basic-pension-couple-reduction-rules", "기초연금 부부 감액과 소득인정액을 확인하는 방법"],
    ["reverse-mortgage-conditions-amounts", "주택연금 가입 조건과 예상 월지급금 확인 순서"],
    ["national-pension-additional-payment-rules", "국민연금 추후납부 신청 전 확인할 자격과 산정 방식"],
    ["voluntary-and-voluntary-continuation-pension", "국민연금 임의가입과 임의계속가입의 차이"],
    ["retirement-pension-db-dc-irp-comparison", "퇴직연금 DB·DC·IRP를 비교할 때 확인할 기준"],
    ["national-pension-income-reduction-rules", "국민연금 수령 중 근로소득이 있을 때 확인할 사항"],
    ["national-pension-silver-loan-guide", "국민연금 실버론 신청 전 조건과 상환 계획 확인하기"],
    ["pension-savings-fund-vs-insurance-tax", "개인연금저축 펀드와 보험을 비교할 때 살펴볼 항목"],
    ["basic-pension-asset-income-conversion-rate", "기초연금 재산의 소득환산액을 이해하는 기본 순서"],
  ],
  health: [
    ["national-health-checkup-cancer-screening", "국가건강검진 대상 조회와 암검진 일정 확인 방법"],
    ["long-term-care-insurance-grades-application", "노인장기요양보험 등급 신청과 방문요양 이용 절차"],
    ["senior-denture-implant-health-insurance", "65세 이상 틀니·임플란트 건강보험 적용 기준 확인하기"],
    ["shingles-vaccination-free-support-schedule", "대상포진 예방접종 지원 여부를 지자체에서 확인하는 방법"],
    ["health-insurance-out-of-pocket-maximum-refund", "본인부담상한제 환급금 조회와 신청 전 확인할 내용"],
    ["chronic-disease-management-benefit", "만성질환관리 시범사업 이용 전 알아둘 점"],
    ["hearing-aid-health-insurance-subsidy", "보청기 급여비 지원과 청각장애 등록 절차 확인하기"],
    ["dementia-relief-center-screening-program", "치매안심센터 선별검사와 상담 이용 방법"],
    ["knee-arthritis-prevention-exercise-guide", "무릎 관절 건강을 위해 생활에서 점검할 신호"],
    ["cataract-surgery-health-insurance-lens", "백내장 수술 전 건강보험 적용과 렌즈 선택 확인 사항"],
  ],
  saving: [
    ["mvno-senior-plan-self-activation", "알뜰폰 시니어 요금제를 비교하고 번호이동 전 확인할 항목"],
    ["energy-voucher-qualification-amounts", "에너지바우처 신청 대상과 사용기간을 확인하는 방법"],
    ["carbon-neutral-points-energy-cashback", "탄소중립포인트 에너지 참여와 절감 실적 확인 방법"],
    ["kepco-electricity-bill-welfare-discount", "한전 전기요금 복지할인 대상과 신청 방법"],
    ["city-gas-bill-discount-application", "도시가스 요금 경감 대상과 신청 전 준비 사항"],
    ["mobile-telecom-welfare-discount", "취약계층 통신요금 감면을 확인하고 신청하는 순서"],
    ["k-pass-transportation-card-refund-rate", "K-패스 환급 조건과 교통비 절약 기록 방법"],
    ["senior-preferential-interest-tax-free-savings", "고령자 비과세종합저축 가입 전 확인할 조건"],
    ["local-currency-discount-purchase-tips", "지역사랑상품권 할인과 소득공제 확인 방법"],
    ["unclaimed-insurance-card-points-refund", "숨은 보험금과 카드 포인트를 안전하게 조회하는 방법"],
  ],
};

const categoryMeta = {
  welfare: { label: "정부지원·복지", eyebrow: "생활 표지 01", accent: "#0F766E", description: "지원 제도와 신청 기준을 공식 안내로 확인합니다." },
  pension: { label: "연금·노후준비", eyebrow: "생활 표지 02", accent: "#B7791F", description: "연금과 노후 준비의 조건을 차분히 살펴봅니다." },
  health: { label: "건강생활", eyebrow: "생활 표지 03", accent: "#C56854", description: "건강 제도와 의료 이용 전 확인할 내용을 정리합니다." },
  saving: { label: "생활비 절약", eyebrow: "생활 표지 04", accent: "#466B76", description: "공공요금과 생활비 절감 제도를 확인합니다." },
};

const allSpecs = Object.entries(catalog).flatMap(([category, values]) => values.map(([slug, title], index) => ({
  slug,
  title,
  category,
  source: sourceByCategory[category],
  publication: index < 3 ? "published" : "scheduled",
  sequence: index < 3 ? 0 : Object.keys(catalog).slice(0, Object.keys(catalog).indexOf(category)).reduce((sum, key) => sum + 7, 0) + index - 2,
})));

const schema = {
  type: "object",
  properties: {
    excerpt: { type: "string" },
    intro: { type: "string" },
    sections: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        properties: {
          heading: { type: "string" },
          paragraphs: { type: "array", minItems: 2, maxItems: 2, items: { type: "string" } },
          bullets: { type: "array", minItems: 3, maxItems: 4, items: { type: "string" } },
        },
        required: ["heading", "paragraphs", "bullets"],
        additionalProperties: false,
      },
    },
  },
  required: ["excerpt", "intro", "sections"],
  additionalProperties: false,
};

async function draft(spec) {
  const body = {
    model: "gpt-5-mini",
    messages: [
      { role: "system", content: "당신은 한국의 공공 생활정보 편집자입니다. 의학·금융·복지 제도에서 사실을 꾸며내지 마세요. 숫자, 연도, 대상 연령, 금액, 비율을 새로 만들지 말고 ‘공식 원문에서 현재 기준을 확인’하도록 쓰세요. 개인별 결과를 단정하지 마세요. 문체는 차분하고 실용적인 존댓말입니다." },
      { role: "user", content: `다음 기사 초안을 JSON으로 작성하세요. 제목: ${spec.title}\n카테고리: ${categoryMeta[spec.category].label}\n공식 확인 경로: ${spec.source.label} (${spec.source.href})\n조건: 도입부와 요약은 각각 2~3문장, 본문은 3개 소제목, 소제목마다 2개 문단과 3~4개의 확인 목록을 작성하세요. 독자가 공식 원문에서 확인해야 할 항목·신청 전 준비할 정보·주의할 점에 집중하세요. 수치를 임의로 넣지 말고 출처 원문 확인을 권하세요.` },
    ],
    response_format: { type: "json_schema", json_schema: { name: "article_draft", strict: true, schema } },
    max_completion_tokens: 1100,
  };
  const response = await fetch(`${apiBase.replace(/\/$/, "")}/v1/chat/completions`, { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!response.ok) throw new Error(`Draft request failed for ${spec.slug}: ${response.status} ${await response.text()}`);
  const payload = await response.json();
  return JSON.parse(payload.choices[0].message.content);
}

async function run() {
  const results = new Array(allSpecs.length);
  const batchSize = 4;
  for (let start = 0; start < allSpecs.length; start += batchSize) {
    const batch = allSpecs.slice(start, start + batchSize);
    const drafted = await Promise.all(batch.map(async (spec, offset) => {
      const content = await draft(spec);
      const record = {
        ...spec,
        ...content,
        readingTime: "약 5분",
        updated: "공식 원문 확인 필요",
        source: spec.source,
      };
      const index = start + offset;
      console.log(`[${index + 1}/${allSpecs.length}] ${spec.slug}`);
      return record;
    }));
    drafted.forEach((record, offset) => { results[start + offset] = record; });
  }
  await mkdir("content", { recursive: true });
  await writeFile("content/article-manifest.json", JSON.stringify({ categoryMeta, articles: results }, null, 2), "utf8");
}

await run();
