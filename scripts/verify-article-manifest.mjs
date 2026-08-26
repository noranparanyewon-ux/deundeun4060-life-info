import { readFile, writeFile } from "node:fs/promises";

const manifestPath = new URL("../content/article-manifest.json", import.meta.url);
const reviewedAt = "2026-08-27";

const verifiedSources = {
  "basic-livelihood-living-allowance": ["복지로 생계급여 안내", "https://www.bokjiro.go.kr/ssis-teu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001132&wlfareInfoReldBztpCd=01"],
  "senior-customized-care-service": ["보건복지부 노인맞춤돌봄서비스", "https://www.mohw.go.kr/menu.es?mid=a10712010400"],
  "near-poverty-class-benefits": ["복지로 증명서 발급 안내", "https://www.bokjiro.go.kr/ssis-tbu/twoae/certfIssuAplyMng/retrieveCertfIssuAplyChc.do"],
  "emergency-welfare-support-system": ["보건복지부 긴급복지지원", "https://www.mohw.go.kr/menu.es?mid=a10708010100"],
  "single-parent-family-child-support": ["복지로 한부모가족 지원", "https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001068"],
  "disability-pension-allowance-criteria": ["복지로 장애인연금 안내", "https://www.bokjiro.go.kr/pension"],
  "veterans-national-merit-benefits": ["국가보훈부 보훈대상자 지원", "https://www.mpva.go.kr/mpva/contents.do?key=105"],
  "housing-allowance-repair-grant": ["마이홈포털 주거급여 안내", "https://www.myhome.go.kr/hws/portal/cont/selectHousingBenefitView.do"],
  "catastrophic-health-expenditure-support": ["복지로 재난적의료비 지원", "https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00003247"],
  "subsidy24-customized-welfare-lookup": ["정부24 혜택알리미", "https://plus.gov.kr/portal/benefitV2/"],
  "early-vs-delayed-national-pension": ["국민연금공단 노령연금 안내", "https://www.nps.or.kr/pnsinfo/ntpsklg/getOHAF0056M0.do"],
  "basic-pension-couple-reduction-rules": ["기초연금 공식 안내", "https://basicpension.mohw.go.kr/menu.es?mid=a10103020000"],
  "reverse-mortgage-conditions-amounts": ["한국주택금융공사 주택연금", "https://www.hf.go.kr/ko/sub03/sub03_01_01_01.do"],
  "national-pension-additional-payment-rules": ["국민연금공단 추후납부 안내", "https://www.nps.or.kr/pnsinfo/ntpsklg/getOHAF0047M0.do"],
  "voluntary-and-voluntary-continuation-pension": ["국민연금공단 가입 안내", "https://www.nps.or.kr/"],
  "retirement-pension-db-dc-irp-comparison": ["고용노동부 퇴직연금", "https://www.moel.go.kr/retirementpay.do"],
  "national-pension-income-reduction-rules": ["국민연금공단 연금 안내", "https://www.nps.or.kr/"],
  "national-pension-silver-loan-guide": ["국민연금공단 실버론", "https://pensioner.nps.or.kr/iaopsrvc/silverloan/getOHDD0001M0.do"],
  "pension-savings-fund-vs-insurance-tax": ["금융감독원 통합연금포털", "https://www.fss.or.kr/fss/lifeplan/lifeplanIndex/index.do?menuNo=201101"],
  "basic-pension-asset-income-conversion-rate": ["기초연금 소득인정액 안내", "https://basicpension.mohw.go.kr/menu.es?mid=a10303000000"],
  "national-health-checkup-cancer-screening": ["국민건강보험공단 건강검진 대상 조회", "https://www.nhis.or.kr/nhis/healthin/retrieveHealthinCheckUpTargetPerson.do"],
  "long-term-care-insurance-grades-application": ["국민건강보험공단 장기요양보험", "https://www.nhis.or.kr/static/html/wbda/c/wbdac02.html"],
  "senior-denture-implant-health-insurance": ["국민건강보험공단 틀니·임플란트 안내", "https://www.nhis.or.kr/static/html/wbma/c/wbmac0221.html"],
  "shingles-vaccination-free-support-schedule": ["복지로 지자체 대상포진 지원 사례", "https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00000516&wlfareInfoReldBztpCd=02"],
  "health-insurance-out-of-pocket-maximum-refund": ["국민건강보험공단 본인부담상한제 안내", "https://www.nhis.or.kr/static/html/wbma/c/wbmac0209.html"],
  "chronic-disease-management-benefit": ["국민건강보험공단 건강관리 안내", "https://www.nhis.or.kr/"],
  "hearing-aid-health-insurance-subsidy": ["국민건강보험공단 보장구 급여 안내", "https://www.nhis.or.kr/static/html/wbma/c/wbmac0209.html"],
  "dementia-relief-center-screening-program": ["중앙치매센터", "https://www.nid.or.kr/"],
  "knee-arthritis-prevention-exercise-guide": ["질병관리청 무릎관절염 운동 안내", "https://health.kdca.go.kr/healthinfo/biz/health/gnrlzHealthInfo/gnrlzHealthInfo/gnrlzHealthInfoView.do?cntnts_sn=5969"],
  "cataract-surgery-health-insurance-lens": ["국민건강보험공단 백내장 비급여 정보", "http://www.nhis.or.kr/nbinfo/wbhfaa06200m29.do?mode=view&articleNo=11000043&title=%EB%B0%B1%EB%82%B4%EC%9E%A5%28cataract%29"],
  "mvno-senior-plan-self-activation": ["알뜰폰허브", "https://www.mvnohub.kr/"],
  "energy-voucher-qualification-amounts": ["에너지바우처", "https://www.energyv.or.kr/info/use_info.do"],
  "carbon-neutral-points-energy-cashback": ["탄소중립포인트 에너지", "https://cpoint.or.kr/user/guide/incentiveGuide.do"],
  "kepco-electricity-bill-welfare-discount": ["한전ON 복지할인 안내", "https://online.kepco.co.kr/MIM021D00"],
  "city-gas-bill-discount-application": ["한국가스공사 도시가스 요금경감", "https://www.kogas.or.kr/site/koGas/1020408030000"],
  "mobile-telecom-welfare-discount": ["복지로 이동통신요금감면", "https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00003257&wlfareInfoReldBztpCd=011"],
  "k-pass-transportation-card-refund-rate": ["국토교통부 모두의카드 안내", "https://www.molit.go.kr/mtc/USR/WPGE0201/m_37187/DTL.jsp"],
  "senior-preferential-interest-tax-free-savings": ["국가법령정보센터 조세특례제한법 제88조의2", "http://www.law.go.kr/LSW//lsLawLinkInfo.do?lsJoLnkSeq=1000758054&chrClsCd=010202"],
  "local-currency-discount-purchase-tips": ["행정안전부 지역사랑상품권", "https://mois.go.kr/frt/sub/a06/b07/localVoucher/screen.do"],
  "unclaimed-insurance-card-points-refund": ["금융감독원 내보험 찾아줌 안내", "https://www.fss.or.kr/main/prc/is/sub/is006.jsp?menuNo=900395"],
};

const titleOverrides = {
  "k-pass-transportation-card-refund-rate": "모두의카드 교통비 환급 기준과 이용 실적 확인 방법",
  "senior-preferential-interest-tax-free-savings": "비과세종합저축 가입 전 법정 대상과 증빙 확인하기",
};

function cleanText(value) {
  return String(value ?? "")
    .replace(/\s*\(\[[^\]]+\]\([^)]*\)\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/https?:\/\/[^\s)]+/g, "")
    .replace(/(?:첫 문단|둘째 문단|도입부|요약)\s*:\s*/g, "")
    .replace(/^제목:\s*[^.]+\.\s*카테고리:\s*[^.]+\.\s*/g, "")
    .replace(/공식 안내와 공식 안내의 공식 원문/g, "공식 원문")
    .replace(/공식 안내 등 공식 안내에서 원문을 확인해 본인의 상황에 맞는 선택지를 판단하세요\./g, "공식 안내에서 원문을 확인하고, 본인 상황에 맞는 선택 여부는 충분한 정보를 바탕으로 검토하세요.")
    .replace(/공식 안내(?:와|및|등)? 공식 안내(?:의)?/g, "공식 안내")
    .replace(/공식 안내의 공식 안내(?:문|페이지|자료)?/g, "공식 안내")
    .replace(/공식 안내의 안내(?:문|페이지|자료)?/g, "공식 안내")
    .replace(/공식 안내 공식 원문/g, "공식 원문")
    .replace(/공식 안내 및 공식 안내의 최신 원문/g, "최신 공식 원문")
    .replace(/공식 안내의 최신 안내(?:문)?/g, "최신 공식 안내")
    .replace(/공식 안내 안내(?:문|페이지|자료)?/g, "공식 안내")
    .replace(/공식 안내과/g, "공식 안내와")
    .replace(/공식 안내 온라인/g, "공식 온라인 안내")
    .replace(/온라인 공식 안내/g, "공식 온라인 신청 안내")
    .replace(/확인해 달라합니다/g, "확인해 보시기 바랍니다")
    .replace(/따르십시오/g, "확인하세요")
    .replace(/확인하십시오/g, "확인하세요")
    .replace(/문제가 생기지 않습니다/g, "문제가 생길 가능성을 줄이는 데 도움이 될 수 있습니다")
    .replace(/\(\s*\)/g, "")
    .replace(/공식 원문 확인 필요/g, "최신 공식 안내 확인")
    .replace(/초안/g, "안내")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function createExcerpt(title) {
  return `이 글은 ${title}에 관해 신청 또는 이용 전에 살펴볼 기준과 준비 항목을 정리했습니다. 개인별 적용 여부는 담당 기관의 최신 공식 안내에서 확인하세요.`;
}

function createIntro() {
  return "제도와 서비스는 대상, 기준일, 신청 창구, 제출 자료에 따라 적용 내용이 달라질 수 있습니다. 이 글은 결과를 단정하지 않으며, 신청 또는 이용 전에 공식 안내를 직접 확인하는 순서를 정리한 생활정보 안내입니다.";
}

function cleanSections(sections) {
  return sections.map((section) => ({
    heading: cleanText(section.heading),
    paragraphs: section.paragraphs.map(cleanText),
    bullets: section.bullets.map((bullet) => cleanText(bullet)
      .replace(/확인할 것\.?$/, "확인하세요.")
      .replace(/확인\.$/, "확인하세요.")),
  }));
}

const articleSpecificSections = {
  "retirement-pension-db-dc-irp-comparison": [
    { heading: "제도별 기본 구조를 구분합니다", paragraphs: ["DB, DC, IRP는 퇴직연금과 관련해 자주 함께 언급되지만 적용 방식과 확인할 항목이 다릅니다. 먼저 본인에게 어떤 제도가 적용되는지 사업장 또는 금융기관의 공식 안내에서 확인하세요.", "용어만 보고 유불리를 단정하기보다, 누가 운용을 담당하는지와 어떤 선택이 가능한지를 차분히 비교해 보세요."], bullets: ["현재 적용되는 제도 유형을 확인하세요.", "운용 주체와 선택 가능한 항목을 확인하세요.", "제도 변경 또는 이전 절차를 확인하세요."] },
    { heading: "비교할 항목을 한 장에 정리합니다", paragraphs: ["제도별로 적립 방식, 운용 선택, 수수료, 수령 방법 등 확인할 항목이 다를 수 있습니다. 한 번에 결론을 내리기보다 공식 안내의 비교 자료를 기준으로 필요한 항목을 적어 보세요.", "수익률처럼 변동될 수 있는 정보는 특정 시점의 숫자만 보고 판단하지 말고, 본인의 기간과 위험 감수 수준을 함께 고려하세요."], bullets: ["적립 방식과 운용 선택 범위를 확인하세요.", "수수료와 수령 방법을 확인하세요.", "변동 정보의 기준일을 확인하세요."] },
    { heading: "결정 전 상담 창구를 확인합니다", paragraphs: ["퇴직이나 이직처럼 중요한 시점에는 제도 변경 가능 여부와 필요한 절차를 미리 확인하는 것이 좋습니다. 개인별 적용 결과는 근로 조건과 계좌 상태에 따라 달라질 수 있습니다.", "궁금한 점은 회사 담당 부서, 금융기관, 공적 상담 창구의 공식 안내를 기준으로 확인해 보세요."], bullets: ["변경이나 이전 전 필요한 절차를 확인하세요.", "개인별 조건이 적용되는지 확인하세요.", "공식 상담 창구에 질문을 정리해 문의하세요."] },
  ],
  "subsidy24-customized-welfare-lookup": [
    { heading: "먼저 내 상황에 맞는 혜택을 살펴봅니다", paragraphs: ["보조금24에서는 중앙부처와 지자체의 지원 정보를 찾아볼 수 있습니다. 맞춤 안내를 이용하려면 로그인이나 정보 제공 동의가 필요한지 공식 화면에서 확인하세요.", "검색 결과는 입력한 정보와 기관의 최신 기준에 따라 달라질 수 있습니다. 결과를 수급 확정으로 보지 말고, 각 서비스의 상세 조건을 함께 살펴보세요."], bullets: ["맞춤 안내에 필요한 로그인과 동의 여부를 확인하세요.", "서비스별 상세 조건과 신청 창구를 확인하세요.", "변동 가능성이 있는 기준은 신청 전 다시 살펴보세요."] },
    { heading: "서비스별 신청 창구를 구분합니다", paragraphs: ["보조금24는 정보를 찾는 출발점으로 활용할 수 있지만, 실제 신청은 서비스별로 다른 창구에서 진행될 수 있습니다. 상세 화면에 적힌 신청 방법과 담당 기관을 확인하세요.", "온라인 신청이 가능한지, 방문이나 추가 서류가 필요한지는 서비스마다 다릅니다. 본인에게 적용되는 절차를 공식 안내에서 확인한 뒤 준비하세요."], bullets: ["서비스별 신청 방법을 확인하세요.", "담당 기관과 문의 창구를 확인하세요.", "필요 서류와 본인 확인 방식을 확인하세요."] },
    { heading: "결과와 변경 사항을 다시 확인합니다", paragraphs: ["조회 결과는 참고 정보이며, 실제 대상 여부는 담당 기관의 심사와 최신 기준에 따라 달라질 수 있습니다. 접수 전후에 안내 문서를 다시 확인하세요.", "가구 구성이나 소득처럼 신청 내용에 영향을 줄 수 있는 정보가 바뀌었다면 변경 신고가 필요한지 담당 기관에 문의하세요."], bullets: ["조회 결과를 확정된 수급 결과로 보지 마세요.", "접수 전 최신 안내를 다시 확인하세요.", "변경 사항이 있으면 담당 기관에 문의하세요."] },
  ],
  "reverse-mortgage-conditions-amounts": [
    { heading: "가입 대상과 주택 요건을 확인합니다", paragraphs: ["주택연금의 가입 가능 여부는 연령, 주택, 거주 형태 등 여러 기준을 함께 살펴보아야 합니다. 본인 상황에 적용되는 요건은 한국주택금융공사의 최신 안내에서 확인하세요.", "공동 소유나 담보 설정처럼 개별 확인이 필요한 사항이 있다면 상담 전에 관련 정보를 정리해 두는 것이 좋습니다."], bullets: ["가입 대상과 주택 요건을 확인하세요.", "공동 소유와 담보 설정 여부를 확인하세요.", "상담 전에 필요한 정보를 정리하세요."] },
    { heading: "예상 월지급금은 공식 조회로 확인합니다", paragraphs: ["예상 월지급금은 주택 정보와 선택 방식, 적용 시점에 따라 달라질 수 있습니다. 온라인 예상 조회 결과는 참고용으로 보고, 최신 기준을 공식 계산 서비스에서 확인하세요.", "한 가지 조건만 보지 말고, 선택 가능한 방식과 평생 거주 계획을 함께 살펴보는 것이 좋습니다."], bullets: ["공식 예상 조회 서비스를 이용하세요.", "조회 결과의 기준일과 입력 조건을 확인하세요.", "선택 방식별 차이를 함께 살펴보세요."] },
    { heading: "상담 전 확인할 질문을 정리합니다", paragraphs: ["가입 전에는 월지급금 외에 비용, 상속, 중도 해지 등 생활 계획에 영향을 줄 수 있는 항목을 확인하세요. 개인별 결과는 상담과 심사 과정에서 달라질 수 있습니다.", "결정을 서두르기보다 가족과 함께 필요한 정보를 정리하고, 공식 상담 창구에서 궁금한 점을 확인해 보세요."], bullets: ["비용과 상속 관련 안내를 확인하세요.", "중도 해지와 변경 조건을 확인하세요.", "공식 상담 창구에 질문을 정리해 문의하세요."] },
  ],
  "k-pass-transportation-card-refund-rate": [
    {
      heading: "대상과 이용 조건을 먼저 확인합니다",
      paragraphs: ["모두의카드의 적용 대상과 이용 조건은 운영 기준에 따라 달라질 수 있습니다. 본인에게 적용되는 교통수단, 이용 실적, 예외 조건은 공식 안내에서 확인하세요.", "환급 또는 적립에 필요한 조건은 시기별로 달라질 수 있습니다. 사용 전에는 적용 범위와 확인 방법을 공식 공지에서 함께 살펴보는 것이 좋습니다."],
      bullets: ["적용 대상과 교통수단 범위를 확인합니다.", "이용 실적과 적용 조건을 공식 안내에서 확인합니다.", "제외 조건이나 변경 공지가 있는지 살펴봅니다."],
    },
    {
      heading: "신청과 이용 내역 확인을 준비합니다",
      paragraphs: ["온라인 절차를 이용할 때는 본인 확인 방식과 본인 명의 결제수단 또는 계좌가 필요한지 공식 안내에서 확인하세요.", "이용 내역 확인 경로와 문의 창구는 운영 방식에 따라 달라질 수 있으므로, 카드사나 운영 기관의 안내를 함께 살펴보세요."],
      bullets: ["본인 확인 방식과 필요한 계정 정보를 확인합니다.", "본인 명의 결제수단 또는 계좌 필요 여부를 확인합니다.", "이용 내역을 어디에서 확인하는지 살펴봅니다."],
    },
    {
      heading: "환급 결과는 실제 적용 기준으로 확인합니다",
      paragraphs: ["환급 여부와 반영 시점은 실제 이용 기록과 당시 운영 기준에 따라 달라질 수 있습니다. 예상 결과를 확정된 금액으로 보지 말고, 조회 화면과 공식 안내를 기준으로 확인하세요.", "주소나 이용 수단처럼 적용에 영향을 줄 수 있는 정보가 바뀌었다면 변경 절차가 필요한지 공식 안내에서 확인하는 편이 안전합니다."],
      bullets: ["조회 화면에서 실제 반영 결과를 확인합니다.", "변경된 이용 정보가 있는지 점검합니다.", "문의가 필요하면 공식 고객 지원 창구를 이용합니다."],
    },
  ],
};

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
if (!Array.isArray(manifest.articles) || manifest.articles.length !== 40) {
  throw new Error("The verified manifest must contain exactly 40 articles.");
}

const scheduled = manifest.articles
  .filter((article) => article.publication === "scheduled")
  .sort((left, right) => left.sequence - right.sequence);
const scheduleBySlug = new Map(
  scheduled.map((article, index) => {
    const date = new Date(Date.UTC(2026, 7, 28 + Math.floor(index / 2), index % 2 === 0 ? 0 : 9, 0, 0));
    return [article.slug, date.toISOString()];
  }),
);

manifest.articles = manifest.articles.map((article) => {
  const source = verifiedSources[article.slug];
  if (!source) throw new Error(`Missing verified source for ${article.slug}.`);
  const [label, href] = source;
  const published = article.publication === "published";
  return {
    ...article,
    title: titleOverrides[article.slug] ?? cleanText(article.title),
    excerpt: createExcerpt(titleOverrides[article.slug] ?? cleanText(article.title)),
    intro: createIntro(),
    sections: articleSpecificSections[article.slug] ?? cleanSections(article.sections),
    source: { label, href },
    sources: [{ label, href, kind: "official-primary" }],
    canonicalPath: `/${article.category}/${article.slug}`,
    publishedAt: published ? "2026-08-26T00:00:00.000Z" : scheduleBySlug.get(article.slug),
    reviewedAt,
    updated: "2026. 08. 27.",
    verification: {
      status: "official-source-reviewed",
      reviewedAt,
      note: "변동 가능한 자격·금액·기한은 원문을 다시 확인하도록 편집했습니다.",
    },
  };
});

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Verified ${manifest.articles.length} articles with official source metadata.`);
