import { verifiedContent } from "./verifiedContent.generated";

export type CategorySlug = "welfare" | "pension" | "health" | "saving";

export type Category = {
  slug: CategorySlug;
  label: string;
  eyebrow: string;
  accent: string;
  description: string;
};

export type ArticleSection = {
  heading: string;
  paragraphs: string[];
  bullets: string[];
};

export type Article = {
  slug: string;
  title: string;
  category: CategorySlug;
  excerpt: string;
  intro: string;
  sections: ArticleSection[];
  readingTime: string;
  updated: string;
  reviewedAt: string;
  publishedAt: string;
  canonicalPath: string;
  publication: "published";
  image: string;
  imageAlt: string;
  links?: { label: string; href: string }[];
  source: { label: string; href: string };
  sources: { label: string; href: string; kind: "official-primary" }[];
  verification: { status: "official-source-reviewed"; reviewedAt: string; note: string };
};

const categoryOrder: CategorySlug[] = ["welfare", "pension", "health", "saving"];
const categoryMeta = verifiedContent.categoryMeta as Record<CategorySlug, Omit<Category, "slug">>;

export const categories: Category[] = categoryOrder.map((slug) => ({ slug, ...categoryMeta[slug] }));
export const withSiteBasePath = (assetPath: string, basePath = import.meta.env.BASE_URL) => `${basePath.replace(/\/?$/, "/")}${assetPath.replace(/^\/+/, "")}`;

export const articles = (verifiedContent.articles as unknown as Article[]).map((article) => ({
  ...article,
  image: withSiteBasePath(article.image),
}));

export type LegacyArticle = {
  slug: string;
  title: string;
  excerpt: string;
  intro: string;
  sections: ArticleSection[];
  readingTime: string;
  updated: string;
  image?: string;
  canonicalPath: string;
  source: { label: string; href: string };
  links: { label: string; href: string }[];
};

export const legacyDigitalArticles: LegacyArticle[] = [
  {
    slug: "smartphone-security-checklist",
    title: "스마트폰을 바꾼 뒤 가장 먼저 확인할 보안 설정",
    excerpt: "새 기기를 샀을 때는 잠금, 업데이트, 계정 복구 방법을 먼저 확인하면 분실이나 계정 문제에 대비하는 데 도움이 됩니다.",
    readingTime: "5분 읽기",
    updated: "2026. 08. 24.",
    canonicalPath: "/archive/digital/smartphone-security-checklist",
    intro: "이 글은 기존 디지털 자료를 보존한 안내입니다. 현재 사이트의 핵심 공개·예약 발행 체계에는 포함하지 않으며, 기기와 운영체제에 따라 메뉴 이름이 달라질 수 있으므로 실제 설정 화면과 공식 보안 안내를 함께 확인하세요.",
    sections: [
      { heading: "잠금 방식과 자동 업데이트를 확인합니다", paragraphs: ["화면 잠금은 다른 사람이 쉽게 추측할 수 없는 방식으로 설정하고, 잠금이 해제된 상태로 오래 방치되지 않도록 자동 잠금 시간을 확인하세요.", "운영체제와 주요 앱의 업데이트 알림을 유지하고, 설정 메뉴에서 ‘보안’, ‘개인정보 보호’, ‘소프트웨어 업데이트’와 같은 항목을 찾아보세요."], bullets: ["화면 잠금 방식과 자동 잠금 시간을 확인합니다.", "운영체제와 주요 앱의 업데이트 상태를 점검합니다.", "제조사와 운영체제별 메뉴 이름 차이를 확인합니다."] },
      { heading: "계정 복구 수단을 미리 등록합니다", paragraphs: ["스마트폰을 잃어버리거나 비밀번호를 잊었을 때 사용할 복구 이메일과 전화번호가 현재 사용하는 정보인지 확인하세요.", "여러 계정을 한 번에 관리하기 어렵다면 자주 쓰는 계정부터 점검하고, 비밀번호나 인증번호를 다른 사람에게 전달하지 마세요."], bullets: ["복구 이메일과 전화번호가 최신 정보인지 확인합니다.", "자주 쓰는 계정부터 순서대로 점검합니다.", "인증번호와 비밀번호는 누구에게도 전달하지 않습니다."] },
      { heading: "앱 권한은 필요한 만큼만 허용합니다", paragraphs: ["손전등이나 메모처럼 기능에 위치 정보가 필요하지 않은 앱이 과도한 권한을 요청한다면, 설치를 멈추고 개발자와 앱 설명을 확인하세요.", "이미 설치한 앱은 권한 관리 메뉴에서 카메라·마이크·위치 접근을 다시 살펴보고, 사용하지 않는 권한은 해제하는 방법을 검토할 수 있습니다."], bullets: ["앱이 요청하는 권한이 기능에 필요한지 살펴봅니다.", "개발자와 앱 설명을 확인한 뒤 설치합니다.", "권한 관리 메뉴에서 기존 접근 권한을 점검합니다."] },
    ],
    links: [{ label: "한국인터넷진흥원 공식 홈페이지", href: "https://www.kisa.or.kr/" }],
    source: { label: "한국인터넷진흥원", href: "https://www.kisa.or.kr/" },
  },
];

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function getLegacyDigitalArticle(slug: string) {
  return legacyDigitalArticles.find((article) => article.slug === slug);
}

export function getArticlesByCategory(slug: string) {
  return articles.filter((article) => article.category === slug);
}

export const siteName = "든든한 4060 생활정보";
export const siteDescription = "40~60대와 가족을 위한 복지·연금·건강·생활비 절약 정보 아카이브";
