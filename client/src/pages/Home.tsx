/* Editorial Life Webzine / 크림 지면 / 세리프 헤드라인 / 코너형 매거진 그리드 */
import { useRef, useState, type CSSProperties } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Clock3, Compass, FileText, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { articles, getCategory } from "../lib/siteData";

const featured = articles.find((article) => article.featured) ?? articles[0];
const welfare = articles.find((article) => article.category === "welfare") ?? featured;
const pension = articles.find((article) => article.category === "pension") ?? featured;
const health = articles.find((article) => article.category === "health") ?? featured;
const saving = articles.find((article) => article.category === "saving") ?? featured;
const digital = articles.find((article) => article.category === "digital") ?? featured;
const featureStories = [featured, pension, health, saving, digital];

function CategoryLabel({ slug }: { slug: string }) {
  const category = getCategory(slug);
  return <span className="category-label" style={{ "--label-accent": category?.accent } as CSSProperties}>{category?.label ?? "생활정보"}</span>;
}

function MagazineCard({ article, featuredCard = false, visual = "paper" }: { article: typeof featured; featuredCard?: boolean; visual?: "paper" | "line" | "sun" | "grid" }) {
  return <Link href={`/article/${article.slug}`} className={`magazine-card ${featuredCard ? "magazine-card--feature" : ""}`}>
    <div className={`magazine-card__visual magazine-card__visual--${visual}`}>
      {article.image ? <><img src={article.image} alt="생활 정보 글을 상징하는 편집 사진" /><span className="magazine-card__image-label">생활표지 · 공식 안내 확인</span></> : <><span className="magazine-card__folio">생활 기록 · {article.updated}</span><span className="magazine-card__symbol">{visual === "sun" ? "○" : visual === "grid" ? "□" : visual === "line" ? "—" : "◇"}</span><span className="magazine-card__visual-note">{getCategory(article.category)?.eyebrow} · 확인표</span></>}
    </div>
    <div className="magazine-card__body">
      <div className="magazine-card__meta"><CategoryLabel slug={article.category} /><span>업데이트 {article.updated}</span><span className="magazine-card__verified">공식 안내 확인</span></div>
      <h3>{article.title}</h3>
      <p>{article.excerpt}</p>
      <span className="magazine-card__foot"><Clock3 size={14} /> {article.readingTime}<ArrowRight size={16} /></span>
    </div>
  </Link>;
}

function CornerHead({ issue, title, description, href }: { issue: string; title: string; description: string; href: string }) {
  return <div className="webzine-corner-head"><div><span>{issue}</span><h2>{title}</h2><p>{description}</p></div><Link href={href} aria-label={`${title} 전체 보기`}><ArrowRight size={19} /></Link></div>;
}

function FeaturedStorySlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const swipeStartX = useRef<number | null>(null);
  const activeStory = featureStories[activeIndex];
  const moveTo = (index: number) => setActiveIndex((index + featureStories.length) % featureStories.length);
  const onSwipeEnd = (clientX: number) => {
    if (swipeStartX.current === null) return;
    const distance = clientX - swipeStartX.current;
    if (Math.abs(distance) > 45) moveTo(activeIndex + (distance < 0 ? 1 : -1));
    swipeStartX.current = null;
  };

  return <section className="webzine-feature container" aria-labelledby="feature-title">
    <div className="webzine-feature__label"><span>이달의 든든한 특집 스토리</span><span>FEATURE {String(activeIndex + 1).padStart(2, "0")}</span></div>
    <div className="featured-slider" role="region" aria-roledescription="carousel" aria-label="이달의 든든한 특집 스토리" tabIndex={0} onKeyDown={(event) => { if (event.key === "ArrowLeft") moveTo(activeIndex - 1); if (event.key === "ArrowRight") moveTo(activeIndex + 1); }} onTouchStart={(event) => { swipeStartX.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={(event) => onSwipeEnd(event.changedTouches[0]?.clientX ?? 0)}>
      <Link href={`/article/${activeStory.slug}`} className="webzine-cover" aria-label={`${activeStory.title} 읽기`}>
        <div className="webzine-cover__image"><img src={activeStory.image} alt="생활 정보 글을 상징하는 편집 사진" /><span className="webzine-cover__issue">{String(activeIndex + 1).padStart(2, "0")}</span><span className="webzine-cover__file-label">생활표지 {String(activeIndex + 1).padStart(2, "0")} · 확인용 특집</span></div>
        <div className="webzine-cover__copy"><CategoryLabel slug={activeStory.category} /><span className="webzine-cover__status">업데이트 {activeStory.updated} · 공식 안내 확인</span><h1 id="feature-title">{activeStory.title}</h1><p>{activeStory.excerpt}</p><div className="webzine-cover__foot"><span>먼저 확인할 것: 대상 · 시기 · 담당 기관</span><span>조건부터 읽기 <ArrowRight size={17} /></span></div></div>
      </Link>
      <div className="featured-slider__controls"><button type="button" onClick={() => moveTo(activeIndex - 1)} aria-label="이전 특집 기사"><ChevronLeft size={20} /></button><span aria-live="polite">{activeIndex + 1} / {featureStories.length}</span><button type="button" onClick={() => moveTo(activeIndex + 1)} aria-label="다음 특집 기사"><ChevronRight size={20} /></button></div>
      <div className="featured-slider__dots" role="tablist" aria-label="특집 기사 선택">{featureStories.map((story, index) => <button key={story.slug} type="button" className={index === activeIndex ? "is-active" : ""} onClick={() => moveTo(index)} aria-label={`${index + 1}번 특집: ${story.title}`} aria-selected={index === activeIndex} role="tab" />)}</div>
    </div>
  </section>;
}

function LatestArticleStrip() {
  return <section className="home-recent container" aria-labelledby="latest-articles-title"><div className="home-recent__head"><div><span>RECENT ARTICLES</span><h2 id="latest-articles-title">최신 아티클</h2></div><Link href="/search">전체 보기 <ArrowRight size={15} /></Link></div><div className="home-recent__grid">{articles.slice(0, 4).map((article) => <Link key={article.slug} href={`/article/${article.slug}`} className="home-recent-card"><img src={article.image} alt="" /><div><CategoryLabel slug={article.category} /><h3>{article.title}</h3></div></Link>)}</div></section>;
}

export default function Home() {
  return (
    <>
      <section className="webzine-intro">
        <div className="container webzine-intro__inner"><span>DEUNDEUN 4060 · AUGUST 2026</span><p>생활을 차분히 읽고, 다음을 준비하는 시간</p></div>
      </section>

      <FeaturedStorySlider />
      <LatestArticleStrip />

      <section className="webzine-corner container">
        <CornerHead issue="CORNER 01" title="생활 속 복지 톺아보기" description="막연한 검색보다, 나에게 필요한 도움을 찾는 순서부터 살펴봅니다." href="/category/welfare" />
        <div className="webzine-grid webzine-grid--two"><MagazineCard article={welfare} visual="paper" /><MagazineCard article={health} visual="sun" /></div>
      </section>

      <section className="webzine-corner webzine-corner--tint">
        <div className="container"><CornerHead issue="CORNER 02" title="이달의 연금 이야기" description="복잡한 계산보다, 생활의 우선순위에서 시작하는 노후 준비입니다." href="/category/pension" />
          <div className="webzine-spotlight"><div className="webzine-spotlight__mark"><span>생활<br />노트</span><strong>02</strong></div><MagazineCard article={pension} featuredCard visual="line" /><aside><Compass size={24} /><p>연금과 노후 준비는 현재 생활을 돌아보는 질문에서 시작할 수 있습니다.</p><Link href="/category/pension">연금·노후준비 전체 보기 <ArrowRight size={15} /></Link></aside></div>
        </div>
      </section>

      <section className="webzine-corner container">
        <CornerHead issue="CORNER 03" title="오늘의 생활 편집" description="살림의 흐름을 정리하고, 디지털 생활을 안전하게 이어가는 작은 방법들입니다." href="/search" />
        <div className="webzine-grid webzine-grid--three"><MagazineCard article={saving} visual="grid" /><MagazineCard article={digital} visual="line" /><Link href="/about" className="webzine-principle"><Sparkles size={22} /><span>EDITOR'S NOTE</span><h3>정보를 고르는 기준</h3><p>개인의 조건을 단정하지 않고, 공식 안내를 다시 확인할 수 있도록 정리합니다.</p><span>운영 원칙 보기 <ArrowRight size={15} /></span></Link></div>
      </section>

      <section className="webzine-footer-note container"><FileText size={20} /><p>이 사이트는 40~60대의 생활 속 선택을 돕기 위한 정보 참고서입니다. 제도·건강·금융의 최종 기준은 관련 기관의 최신 안내를 확인해 주세요.</p><Link href="/disclaimer">이용안내 <ArrowRight size={15} /></Link></section>
    </>
  );
}
