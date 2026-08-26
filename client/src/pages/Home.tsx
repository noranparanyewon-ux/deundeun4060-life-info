/* 생활 문서 아카이브 / 아이보리 종이 / 잉크 네이비 / 든든한 청록 / 편집 지면형 비대칭 레이아웃 */
import type { CSSProperties } from "react";
import { ArrowRight, Bookmark, Check, ChevronRight, Clock3, Compass, FileCheck2, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { articles, categories, getCategory } from "../lib/siteData";

const featured = articles.find((article) => article.featured) ?? articles[0];
const supportingArticles = articles.filter((article) => article.slug !== featured.slug).slice(0, 3);

function CategoryLabel({ slug }: { slug: string }) {
  const category = getCategory(slug);
  return <span className="category-label" style={{ "--label-accent": category?.accent } as React.CSSProperties}>{category?.label ?? "생활정보"}</span>;
}

export default function Home() {
  return (
    <>
      <section className="home-hero">
        <div className="container hero-layout">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> 오늘의 생활 아카이브</p>
            <h1>내일을 조금 더<br /><em>든든하게</em> 준비하는 법</h1>
            <p className="hero-lede">40~60대를 위한 복지, 연금, 건강, 생활 절약 정보를 한 번 더 확인하고 이해하기 쉽게 정리합니다.</p>
            <div className="hero-actions">
              <Link href="/category/welfare" className="button button--primary">필요한 정보부터 찾기 <ArrowRight size={17} /></Link>
              <Link href="/about" className="text-link">우리가 정리하는 기준 <ChevronRight size={16} /></Link>
            </div>
            <div className="hero-proof"><span><Check size={15} /> 공식 자료 확인을 우선합니다</span><span><Check size={15} /> 읽기 쉬운 생활 언어로 씁니다</span></div>
            <div className="hero-today"><span className="hero-today__label">오늘 확인할 수 있는 것</span><Link href="/category/welfare">받을 수 있는 지원 <ArrowRight size={14} /></Link><Link href="/category/digital">스마트폰 보안 <ArrowRight size={14} /></Link><Link href="/category/health">검진 전 준비 <ArrowRight size={14} /></Link></div>
          </div>
          <div className="hero-visual" aria-label="생활 정보 아카이브를 상징하는 책상 이미지">
            <img src="/manus-storage/deundeun4060-hero_640c5466.png" alt="노트와 생활 서류가 놓인 햇살 드는 책상" />
            <div className="hero-stamp"><Bookmark size={16} /><span>읽어두면<br /><strong>도움이 되는</strong> 정보</span></div>
          </div>
        </div>
      </section>

      <section className="home-signal container" aria-label="사이트 이용 안내">
        <div className="signal-intro"><span className="section-kicker">먼저 읽어보세요</span><h2>지금 필요한 생활의<br />기준을 찾습니다.</h2></div>
        <div className="signal-items">
          <div className="signal-item"><span className="signal-number">01</span><div><strong>상황으로 찾기</strong><p>막연한 키워드보다 지금 필요한 도움부터 골라보세요.</p></div></div>
          <div className="signal-item"><span className="signal-number">02</span><div><strong>핵심부터 읽기</strong><p>조건과 다음 행동을 글의 앞부분에 먼저 담습니다.</p></div></div>
          <div className="signal-item"><span className="signal-number">03</span><div><strong>공식 안내로 확인</strong><p>최신 기준은 원문과 상담 창구에서 다시 확인하세요.</p></div></div>
        </div>
      </section>

      <section className="featured-section">
        <div className="container section-heading-row"><div><span className="section-kicker">이번 주의 중심 글</span><h2>지금 알아두면 좋은 것</h2></div><Link href="/category/welfare" className="section-link">전체 글 보기 <ArrowRight size={16} /></Link></div>
        <div className="container featured-grid">
          <Link href={`/article/${featured.slug}`} className="featured-card">
            <div className="featured-card__visual"><img src={featured.image} alt="정부지원 서류를 정리하는 책상" /><span className="image-note">생활표지 01</span></div>
            <div className="featured-card__content"><div className="featured-file-meta"><CategoryLabel slug={featured.category} /><span>업데이트 {featured.updated}</span><span>공식 자료 확인</span></div><h3>{featured.title}</h3><p>{featured.excerpt}</p><span className="read-more">이 글 읽기 <ArrowRight size={16} /></span></div>
          </Link>
          <aside className="featured-aside"><div className="aside-note"><Sparkles size={18} /><p>정보를 읽을 때는 <strong>‘언제 기준인지’</strong>와 <strong>‘어디에 문의할지’</strong>를 함께 확인해 보세요.</p></div><div className="aside-list"><span className="section-kicker">함께 읽기</span>{supportingArticles.slice(0, 2).map((article) => <Link key={article.slug} href={`/article/${article.slug}`} className="mini-article"><div><CategoryLabel slug={article.category} /><h4>{article.title}</h4><span><Clock3 size={13} /> {article.readingTime} · {article.updated}</span></div><ChevronRight size={18} /></Link>)}</div></aside>
        </div>
      </section>

      <section className="category-section container">
        <div className="section-heading-row"><div><span className="section-kicker">주제별 인덱스</span><h2>내 생활에 맞는 서랍</h2></div><span className="section-caption">다섯 가지 주제로 차곡차곡</span></div>
        <div className="category-grid">{categories.map((category, index) => <Link key={category.slug} href={`/category/${category.slug}`} className={`category-card category-card--${index + 1}`} style={{ "--category-accent": category.accent } as CSSProperties}>{category.image ? <img src={category.image} alt="" /> : <div className="category-card__pattern"><Compass size={26} /></div>}<div className="category-card__veil" /><div className="category-card__file">{category.eyebrow} · 생활표지</div><div className="category-card__copy"><span>{category.eyebrow}</span><h3>{category.label}</h3><p>{category.description}</p><span className="category-arrow"><ArrowRight size={17} /></span></div></Link>)}</div>
      </section>

      <section className="latest-section">
        <div className="container latest-layout"><div className="latest-intro"><span className="section-kicker">새로 정리한 글</span><h2>천천히 읽어도<br /><em>남는 정보</em></h2><p>당장 결론을 내리기보다, 내 상황에 맞는지 확인하는 데 도움이 되는 글을 모읍니다.</p><Link href="/search" className="text-link">모든 글 살펴보기 <ChevronRight size={16} /></Link></div><div className="latest-list">{supportingArticles.map((article, index) => <Link key={article.slug} href={`/article/${article.slug}`} className="latest-row"><span className="latest-index">0{index + 1}</span><div><CategoryLabel slug={article.category} /><h3>{article.title}</h3><p>{article.excerpt}</p></div><div className="latest-meta"><span><Clock3 size={14} /> {article.readingTime}</span><ArrowRight size={17} /></div></Link>)}</div></div>
      </section>

      <section className="home-note container"><div className="note-mark"><FileCheck2 size={27} /></div><div><span className="section-kicker">정보를 이용하는 방법</span><h2>이곳의 글은 판단을 대신하지 않습니다.</h2><p>제도와 건강 정보는 개인의 조건과 시점에 따라 달라질 수 있습니다. 이 사이트는 이해를 돕는 출발점이며, 최종 기준은 각 기관의 최신 안내와 상담을 확인해 주세요.</p></div><Link href="/disclaimer" className="button button--outline">면책 안내 읽기 <ArrowRight size={16} /></Link></section>
    </>
  );
}
