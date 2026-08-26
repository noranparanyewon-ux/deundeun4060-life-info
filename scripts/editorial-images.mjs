const categoryFallbacks = {
  welfare: { image: "editorial/basic-livelihood-living-allowance.svg", imageAlt: "복지 제도 안내 문서와 확인표를 그린 일러스트" },
  pension: { image: "editorial/early-vs-delayed-national-pension.svg", imageAlt: "연금과 노후 준비를 위한 달력과 기록장을 그린 일러스트" },
  health: { image: "editorial/national-health-checkup-cancer-screening.svg", imageAlt: "건강생활 정보 확인을 위한 기록장과 돋보기를 그린 일러스트" },
  saving: { image: "editorial/energy-voucher-qualification-amounts.svg", imageAlt: "생활비와 에너지 사용을 살펴보는 일러스트" },
};

const articleImages = {
  "basic-livelihood-living-allowance": { image: "editorial/basic-livelihood-living-allowance.svg", imageAlt: "생계급여 신청 전 서류와 확인 목록을 살펴보는 일러스트" },
  "senior-customized-care-service": { image: "editorial/senior-customized-care-service.svg", imageAlt: "돌봄서비스 상담 일정과 집 모양 안내 카드를 그린 일러스트" },
  "near-poverty-class-benefits": { image: "editorial/near-poverty-class-benefits.svg", imageAlt: "확인서와 공공요금 고지서를 함께 살펴보는 일러스트" },
  "early-vs-delayed-national-pension": { image: "editorial/early-vs-delayed-national-pension.svg", imageAlt: "연금 수령 시점을 비교하는 달력과 시계 일러스트" },
  "basic-pension-couple-reduction-rules": { image: "editorial/basic-pension-couple-reduction-rules.svg", imageAlt: "부부의 기초연금 확인 자료와 생활 기록을 그린 일러스트" },
  "reverse-mortgage-conditions-amounts": { image: "editorial/reverse-mortgage-conditions-amounts.svg", imageAlt: "주택연금 상담 전 집과 확인 문서를 살펴보는 일러스트" },
  "national-health-checkup-cancer-screening": { image: "editorial/national-health-checkup-cancer-screening.svg", imageAlt: "건강검진 일정과 검진 기록을 확인하는 일러스트" },
  "long-term-care-insurance-grades-application": { image: "editorial/long-term-care-insurance-grades-application.svg", imageAlt: "장기요양 신청 절차와 방문 돌봄 안내를 상징하는 일러스트" },
  "senior-denture-implant-health-insurance": { image: "editorial/senior-denture-implant-health-insurance.svg", imageAlt: "치과 건강보험 적용 여부를 확인하는 치아와 문서 일러스트" },
  "mvno-senior-plan-self-activation": { image: "editorial/mvno-senior-plan-self-activation.svg", imageAlt: "알뜰폰 요금제 비교 전 휴대전화와 유심 카드를 확인하는 일러스트" },
  "energy-voucher-qualification-amounts": { image: "editorial/energy-voucher-qualification-amounts.svg", imageAlt: "에너지바우처 신청 전 주거와 에너지 이용 정보를 살펴보는 일러스트" },
  "carbon-neutral-points-energy-cashback": { image: "editorial/carbon-neutral-points-energy-cashback.svg", imageAlt: "에너지 사용량과 절감 실적을 기록하는 계량기와 잎사귀 일러스트" },
};

export function getEditorialImage(article) {
  return articleImages[article.slug] ?? categoryFallbacks[article.category];
}
