/* 생활 문서 아카이브: 콘텐츠 데이터는 검증 가능한 정보 구조와 상대 URL을 중심으로 구성합니다. */

export type Category = {
  slug: string;
  label: string;
  eyebrow: string;
  description: string;
  accent: string;
  image?: string;
};

export type Article = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readingTime: string;
  updated: string;
  image?: string;
  featured?: boolean;
  intro: string;
  sections: Array<{
    heading: string;
    paragraphs: string[];
    bullets?: string[];
  }>;
  links?: Array<{ label: string; href: string }>;
  source?: { label: string; href: string };
};

export const categories: Category[] = [
  {
    slug: "welfare",
    label: "정부지원·복지",
    eyebrow: "생활 표지 01",
    description: "놓치기 쉬운 지원 제도를 찾고, 신청 전에 확인할 기준을 차분히 정리합니다.",
    accent: "#0F766E",
  },
  {
    slug: "pension",
    label: "연금·노후준비",
    eyebrow: "생활 표지 02",
    description: "국민연금과 노후생활을 이해하기 쉽게 풀어보고, 준비 순서를 안내합니다.",
    accent: "#B7791F",
  },
  {
    slug: "health",
    label: "건강생활",
    eyebrow: "생활 표지 03",
    description: "건강검진과 일상 습관을 중심으로, 확인할 질문과 준비 방법을 정리합니다.",
    accent: "#C56854",
  },
  {
    slug: "saving",
    label: "생활비 절약",
    eyebrow: "생활 표지 04",
    description: "매달 반복되는 지출을 점검하고, 무리하지 않는 절약 루틴을 살펴봅니다.",
    accent: "#466B76",
  },
  {
    slug: "digital",
    label: "스마트폰·디지털 활용",
    eyebrow: "생활 표지 05",
    description: "공공서비스와 스마트폰을 더 안전하고 편하게 사용하는 기본기를 다룹니다.",
    accent: "#5B6F45",
  },
];

export const articles: Article[] = [
  {
    slug: "government-benefit-search-first-steps",
    category: "welfare",
    title: "정부지원 혜택을 찾기 전에 먼저 정리할 세 가지",
    excerpt: "검색창에 바로 뛰어들기보다, 내 상황과 필요한 시기를 먼저 적어두면 지원 제도를 확인하는 순서가 달라집니다.",
    readingTime: "6분 읽기",
    updated: "2026. 08. 26.",
    image: "/manus-storage/deundeun4060-hero_640c5466.png",
    featured: true,
    intro: "정부지원 제도는 이름이 비슷하고 조건도 자주 달라서, 막연하게 ‘받을 수 있는 지원금’을 검색하면 오히려 중요한 기준을 놓치기 쉽습니다. 먼저 내 상황을 짧게 정리한 뒤 공식 안내에서 조건을 대조하는 방식이 안전합니다.",
    sections: [
      {
        heading: "1. 누구를 위한 지원인지 먼저 적습니다",
        paragraphs: [
          "지원 제도를 찾기 전에 가구 구성, 연령대, 거주 지역, 현재 필요한 도움을 한 줄씩 적어보세요. 같은 제도라도 대상과 지역에 따라 안내 창구가 달라질 수 있기 때문입니다.",
          "‘생활비가 부족하다’처럼 넓은 표현보다 ‘매달 고정지출이 부담된다’, ‘돌봄이 필요하다’, ‘일자리를 다시 찾고 있다’처럼 현재 상황을 구체적으로 적으면 검색어와 상담 질문을 만들기 쉬워집니다.",
        ],
      },
      {
        heading: "2. 신청 시기와 담당 기관을 구분합니다",
        paragraphs: [
          "온라인에서 정보를 확인하는 것과 실제 신청을 완료하는 것은 다른 단계입니다. 안내 페이지에서 신청 기간, 접수 기관, 준비 서류, 결과 통보 방법을 따로 표시해 두면 다음 행동이 분명해집니다.",
          "제도 이름만 보고 블로그 글을 바로 믿기보다, 마지막에는 정부24와 관할 행정복지센터 등 공식 안내 창구에서 현재 조건을 다시 확인하세요.",
        ],
        bullets: [
          "내가 확인한 안내의 기준 날짜",
          "신청을 받는 기관과 연락 방법",
          "추가로 준비해야 하는 서류",
        ],
      },
      {
        heading: "3. 나에게 해당되는지 체크한 뒤 문의합니다",
        paragraphs: [
          "조건이 애매할 때는 추측으로 신청 여부를 판단하지 말고, 공식 상담 창구에 질문할 내용을 미리 적어 문의하는 편이 좋습니다. 문의할 때는 주소 전체나 민감한 개인정보를 공개하기 전에 필요한 범위만 확인하세요.",
          "이 사이트에서는 제도별 최신 금액이나 자격을 단정하지 않고, 공식 원문으로 이어지는 확인 경로와 읽는 순서를 함께 제공할 예정입니다.",
        ],
      },
    ],
    links: [
      { label: "정부24에서 관련 서비스 확인하기", href: "https://www.gov.kr/" },
      { label: "복지로에서 복지서비스 살펴보기", href: "https://www.bokjiro.go.kr/" },
    ],
    source: { label: "정부24", href: "https://www.gov.kr/" },
  },
  {
    slug: "smartphone-security-checklist",
    category: "digital",
    title: "스마트폰을 바꾼 뒤 가장 먼저 확인할 보안 설정",
    excerpt: "새 기기를 샀을 때 사진과 연락처를 옮기는 것만큼 중요한 것은 잠금, 업데이트, 계정 복구 방법을 확인하는 일입니다.",
    readingTime: "5분 읽기",
    updated: "2026. 08. 24.",
    image: "/manus-storage/deundeun4060-digital-editorial_e8c7f5da.jpg",
    intro: "스마트폰을 새로 바꾸면 화면과 앱이 익숙하지 않아 보안 설정을 나중으로 미루기 쉽습니다. 하지만 처음 한 번만 확인해 두면 분실이나 계정 문제에 대응하기가 훨씬 수월해집니다.",
    sections: [
      {
        heading: "잠금 방식과 자동 업데이트를 확인합니다",
        paragraphs: [
          "화면 잠금은 다른 사람이 쉽게 추측할 수 없는 방식으로 설정하고, 잠금이 해제된 상태로 오래 방치되지 않도록 자동 잠금 시간을 확인하세요. 운영체제와 주요 앱의 업데이트 알림도 꺼두지 않는 것이 좋습니다.",
          "설정 메뉴의 이름은 제조사와 운영체제 버전에 따라 다를 수 있으므로, 화면에서 ‘보안’, ‘개인정보 보호’, ‘소프트웨어 업데이트’와 같은 항목을 찾아보면 됩니다.",
        ],
      },
      {
        heading: "계정 복구 수단을 미리 등록합니다",
        paragraphs: [
          "스마트폰을 잃어버리거나 비밀번호를 잊었을 때 사용할 복구 이메일과 전화번호가 현재 사용하는 정보인지 확인하세요. 여러 계정을 한 번에 관리하기 어렵다면 자주 쓰는 계정부터 점검해도 좋습니다.",
        ],
      },
      {
        heading: "앱 권한은 필요한 만큼만 허용합니다",
        paragraphs: [
          "손전등이나 메모처럼 기능에 위치 정보가 필요하지 않은 앱이 과도한 권한을 요청한다면, 설치를 멈추고 개발자와 앱 설명을 확인하세요. 이미 설치한 앱은 권한 관리 메뉴에서 카메라·마이크·위치 접근을 다시 살펴볼 수 있습니다.",
        ],
      },
    ],
    links: [
      { label: "KISA 개인정보 보호 안내 확인하기", href: "https://www.kisa.or.kr/" },
    ],
    source: { label: "한국인터넷진흥원", href: "https://www.kisa.or.kr/" },
  },
  {
    slug: "health-checkup-appointment-prep",
    category: "health",
    title: "건강검진 예약 전에 준비하면 좋은 질문 목록",
    excerpt: "검진 항목만 고르는 것보다, 최근의 변화와 복용 중인 약을 먼저 정리하면 상담 시간이 더 알차집니다.",
    readingTime: "4분 읽기",
    updated: "2026. 08. 21.",
    image: "/manus-storage/deundeun4060-health-editorial_0384b5c9.jpg",
    intro: "건강검진을 예약할 때는 검사 날짜만 정하면 끝이라고 생각하기 쉽습니다. 최근 몸의 변화와 궁금한 점을 짧게 기록해 두면 검진 전후에 의료진에게 전달할 내용을 놓치지 않는 데 도움이 됩니다.",
    sections: [
      {
        heading: "최근 달라진 점을 메모합니다",
        paragraphs: [
          "수면, 식사, 체중, 운동, 통증처럼 평소와 달라진 점이 있다면 발생 시기와 빈도를 간단히 적어두세요. 증상을 스스로 진단하려고 하기보다, 관찰한 사실을 전달하는 데 초점을 맞추면 됩니다.",
        ],
      },
      {
        heading: "복용 중인 약과 건강기능식품을 확인합니다",
        paragraphs: [
          "약 이름을 모두 외우기 어렵다면 처방전이나 약 봉투를 사진으로 준비할 수 있습니다. 검진 전 금식이나 복용 중단 여부처럼 개인별로 달라질 수 있는 사항은 예약 기관에 직접 문의하세요.",
        ],
      },
      {
        heading: "검진 결과를 어떻게 받을지 확인합니다",
        paragraphs: [
          "결과를 받는 시기, 결과지 확인 방법, 추가 상담이 필요한 경우의 절차를 예약 전에 물어보면 검진 후의 계획을 세우기 쉽습니다. 건강에 대한 판단은 개인의 상태와 의료진의 설명에 따라 달라질 수 있습니다.",
        ],
      },
    ],
    links: [
      { label: "국민건강보험 건강검진 안내 확인하기", href: "https://www.nhis.or.kr/" },
    ],
    source: { label: "국민건강보험공단", href: "https://www.nhis.or.kr/" },
  },
  {
    slug: "monthly-fixed-cost-review",
    category: "saving",
    title: "생활비를 줄이기 전에 고정지출부터 한 장에 적는 법",
    excerpt: "절약을 시작할 때 가장 먼저 할 일은 무조건 줄이는 것이 아니라, 매달 자동으로 빠져나가는 금액을 확인하는 것입니다.",
    readingTime: "5분 읽기",
    updated: "2026. 08. 18.",
    image: "/manus-storage/deundeun4060-saving-editorial_9a4e39a9.jpg",
    intro: "생활비 절약은 의지만으로 오래 이어지기 어렵습니다. 한 달 동안 자동으로 빠져나가는 돈과 사용량에 따라 달라지는 돈을 분리하면, 줄일 수 있는 항목과 유지해야 하는 항목이 보이기 시작합니다.",
    sections: [
      {
        heading: "고정지출과 변동지출을 나눕니다",
        paragraphs: [
          "월세나 관리비처럼 금액이 크게 변하지 않는 항목과 식비·교통비처럼 사용량에 따라 움직이는 항목을 한 표에 구분해 적어보세요. 먼저 고정지출의 결제일과 해지 조건을 확인하면 빠뜨리기 쉬운 자동결제를 찾기 쉽습니다.",
        ],
      },
      {
        heading: "줄이기보다 사용 여부를 먼저 확인합니다",
        paragraphs: [
          "최근에 사용하지 않은 구독 서비스, 중복으로 가입한 보장, 사용 빈도가 낮은 멤버십처럼 ‘필요성’을 다시 판단할 수 있는 항목부터 살펴보는 편이 부담이 적습니다. 해지나 변경 전에는 환불·위약금·보장 공백 여부를 약관에서 확인하세요.",
        ],
      },
      {
        heading: "다음 달에 확인할 숫자를 하나만 정합니다",
        paragraphs: [
          "모든 지출을 한 번에 바꾸려 하지 말고, 다음 달에는 자동결제 총액이나 외식 횟수처럼 확인할 기준을 하나만 정하세요. 기록이 이어져야 자신의 생활에 맞는 절약 방법을 찾을 수 있습니다.",
        ],
      },
    ],
  },
  {
    slug: "pension-preparation-conversation",
    category: "pension",
    title: "연금 이야기를 가족과 시작할 때 먼저 확인할 생활 질문",
    excerpt: "복잡한 계산보다 현재 생활비와 앞으로의 우선순위를 먼저 이야기하면 준비해야 할 정보가 정리됩니다.",
    readingTime: "5분 읽기",
    updated: "2026. 08. 15.",
    image: "/manus-storage/deundeun4060-pension-editorial_cd5e2a7b.jpg",
    intro: "연금은 숫자만 확인한다고 준비가 끝나는 주제가 아닙니다. 언제 일을 줄이고 싶은지, 어떤 지출을 유지하고 싶은지, 가족과 어떤 도움을 주고받을지부터 정리해야 계산 결과를 생활 계획에 연결할 수 있습니다.",
    sections: [
      {
        heading: "현재 생활비를 기준으로 대화합니다",
        paragraphs: [
          "막연히 ‘노후에 얼마가 필요할까’라고 묻기보다 매달 꼭 필요한 지출과 줄여도 되는 지출을 나눠보세요. 실제 생활에서 반복되는 항목을 기준으로 하면 준비해야 할 부족분을 더 현실적으로 생각할 수 있습니다.",
        ],
      },
      {
        heading: "공식 조회 자료와 개인 계획을 구분합니다",
        paragraphs: [
          "연금 조회 서비스에서 확인한 예상 금액은 입력 내용과 제도 기준에 따라 달라질 수 있는 참고 자료입니다. 조회 결과를 확정된 미래 금액처럼 표현하지 말고, 필요한 경우 공식 상담 창구에서 기준을 확인하세요.",
        ],
      },
      {
        heading: "가족에게 공유할 범위를 정합니다",
        paragraphs: [
          "가족과 재정 정보를 공유할 때는 계정 비밀번호나 인증번호를 전달하지 않고, 생활 계획에 필요한 범위만 이야기하세요. 숫자를 비교하기보다 서로의 기대와 부담을 먼저 확인하는 것이 좋습니다.",
        ],
      },
    ],
    links: [
      { label: "국민연금공단 공식 홈페이지 확인하기", href: "https://www.nps.or.kr/" },
    ],
    source: { label: "국민연금공단", href: "https://www.nps.or.kr/" },
  },
];

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function getArticlesByCategory(slug: string) {
  return articles.filter((article) => article.category === slug);
}

export const siteName = "든든한 4060 생활정보";
export const siteDescription = "40~60대를 위한 복지·연금·건강·생활 절약·디지털 활용 정보 아카이브";
