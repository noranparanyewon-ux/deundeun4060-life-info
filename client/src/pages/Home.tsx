/* 생활 문서 아카이브 / 정보 포털형 홈 / 검색 우선 / 카테고리 그리드 / 최신 글 목록 */
import type { CSSProperties, FormEvent } from "react";
import { useState } from "react";
import { ArrowRight, BadgeDollarSign, BookOpenCheck, CheckCircle2, Clock3, FileText, HeartPulse, Landmark, Search, ShieldCheck, Smartphone, WalletCards } from "lucide-react";
import { Link, useLocation } from "wouter";
import { articles, categories, getCategory } from "../lib/siteData";

const categoryIcons = {
  welfare: Landmark,
  pension: BadgeDollarSign,
  health: HeartPulse,
  saving: WalletCards,
  digital: Smartphone,
};

function CategoryLabel({ slug }: { slug: string }) {
  const category = getCategory(slug);
  return <span className="category-label" style={{ "--label-accent": category?.accent } as CSSProperties}>{category?.label ?? "생활정보"}</span>;
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const latestArticles = [...articles].sort((a, b) => b.updated.localeCompare(a.updated)).slice(0, 5);

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextQuery = query.trim();
    setLocation(nextQuery ? `/search?q=${encodeURIComponent(nextQuery)}` : "/search");
  };

  return (
    <>
      <section className="portal-top">
        <div className="container portal-top__inner">
          <div className="portal-title-row">
            <div>
              <span className="portal-eyebrow">생활 정보 아카이브 · 업데이트 기준 2026.08</span>
              <h1>4060 세대를 위한 생활·복지·연금 정보 아카이브</h1>
            </div>
            <span className="portal-status"><CheckCircle2 size={15} /> 공식 안내 확인 중심</span>
          </div>
          <form className="portal-search" onSubmit={onSearch} role="search">
            <Search size={21} aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="궁금한 생활 정보를 검색하세요. 예: 기초연금, 건강검진, 스마트폰 보안" aria-label="생활 정보 검색" />
            <button type="submit">검색 <ArrowRight size={16} /></button>
          </form>
          <div className="portal-popular"><span>자주 찾는 정보</span><Link href="/category/welfare">정부지원 혜택</Link><Link href="/category/pension">연금·노후준비</Link><Link href="/category/health">건강검진</Link><Link href="/category/digital">스마트폰 보안</Link></div>
        </div>
      </section>

      <section className="portal-categories container" aria-labelledby="portal-category-heading">
        <div className="portal-section-head">
          <div><span className="section-kicker">주제별로 찾기</span><h2 id="portal-category-heading">필요한 정보를 바로 찾아보세요</h2></div>
          <span className="portal-section-note">5개 생활 정보 카테고리</span>
        </div>
        <div className="portal-category-grid">
          {categories.map((category, index) => {
            const Icon = categoryIcons[category.slug as keyof typeof categoryIcons] ?? FileText;
            const count = articles.filter((article) => article.category === category.slug).length;
            return <Link key={category.slug} href={`/category/${category.slug}`} className="portal-category-card" style={{ "--portal-accent": category.accent } as CSSProperties}>
              <span className="portal-category-number">0{index + 1}</span>
              <span className="portal-category-icon"><Icon size={23} /></span>
              <strong>{category.label}</strong>
              <p>{category.description}</p>
              <span className="portal-category-meta">등록 글 {count}개 <ArrowRight size={14} /></span>
            </Link>;
          })}
        </div>
      </section>

      <section className="portal-feed container" aria-labelledby="latest-information-heading">
        <div className="portal-feed__main">
          <div className="portal-section-head portal-section-head--feed">
            <div><span className="section-kicker">최신 생활정보</span><h2 id="latest-information-heading">새로 정리한 글</h2></div>
            <Link href="/search" className="section-link">전체 글 보기 <ArrowRight size={16} /></Link>
          </div>
          <div className="portal-article-list">
            {latestArticles.map((article, index) => <Link key={article.slug} href={`/article/${article.slug}`} className="portal-article-card">
              <span className="portal-article-index">{String(index + 1).padStart(2, "0")}</span>
              <div className="portal-article-copy">
                <div className="portal-article-copy__meta"><CategoryLabel slug={article.category} /><span>업데이트 {article.updated}</span><span className="verified-meta">공식 안내 확인</span></div>
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
                <span className="portal-read-time"><Clock3 size={14} /> {article.readingTime}</span>
              </div>
              <ArrowRight className="portal-article-arrow" size={18} />
            </Link>)}
          </div>
        </div>
        <aside className="portal-side" aria-label="정보 이용 안내">
          <div className="portal-side-card">
            <BookOpenCheck size={23} />
            <span className="section-kicker">이용 전 확인</span>
            <h2>정보는 이렇게 읽어보세요.</h2>
            <ol><li><span>01</span><p>현재 내 상황과 필요한 도움을 먼저 정리합니다.</p></li><li><span>02</span><p>글의 조건·신청 방법·주의사항을 확인합니다.</p></li><li><span>03</span><p>최종 기준은 연결된 공식 안내에서 다시 확인합니다.</p></li></ol>
            <Link href="/about" className="text-link">우리가 정리하는 기준 <ArrowRight size={15} /></Link>
          </div>
          <div className="portal-side-links">
            <div><ShieldCheck size={18} /><span>운영 안내</span></div>
            <Link href="/privacy">개인정보처리방침 <ArrowRight size={14} /></Link>
            <Link href="/disclaimer">이용안내 및 면책조항 <ArrowRight size={14} /></Link>
          </div>
        </aside>
      </section>
    </>
  );
}
