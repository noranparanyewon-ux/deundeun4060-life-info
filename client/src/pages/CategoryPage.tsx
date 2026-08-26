/* 생활 문서 아카이브 / 아이보리 종이 / 잉크 네이비 / 든든한 청록 / 편집 지면형 비대칭 레이아웃 */
import type { CSSProperties } from "react";
import { ArrowRight, Clock3, FileText, MoveUpRight } from "lucide-react";
import { Link, useRoute } from "wouter";
import { articles, categories, getArticlesByCategory, getCategory } from "../lib/siteData";

export default function CategoryPage() {
  const [, params] = useRoute<{ slug: string }>("/category/:slug");
  const category = getCategory(params?.slug ?? "welfare");
  const categoryArticles = getArticlesByCategory(category?.slug ?? "welfare");

  if (!category) {
    return <section className="page-empty container"><span className="section-kicker">주제를 찾을 수 없습니다</span><h1>다시 한 번 선택해 주세요.</h1><Link href="/" className="button button--primary">홈으로 돌아가기 <ArrowRight size={17} /></Link></section>;
  }

  return (
    <>
      <section className="archive-hero" style={{ "--archive-accent": category.accent } as CSSProperties}>
        <div className="container archive-hero__inner"><div className="archive-hero__copy"><span className="eyebrow"><span className="eyebrow-line" /> {category.eyebrow}</span><h1>{category.label}</h1><p>{category.description}</p></div><div className="archive-hero__index"><span>현재 서랍</span><strong>{String(categories.findIndex((item) => item.slug === category.slug) + 1).padStart(2, "0")}</strong><span>/ 05</span></div></div>
      </section>
      <div className="container breadcrumb"><Link href="/">홈</Link><span>/</span><span>{category.label}</span></div>
      <section className="archive-body container"><aside className="archive-sidebar"><span className="section-kicker">주제별 인덱스</span>{categories.map((item) => <Link key={item.slug} className={item.slug === category.slug ? "is-current" : ""} href={`/category/${item.slug}`}><span>{item.label}</span><ArrowRight size={15} /></Link>)}<div className="sidebar-note"><FileText size={18} /><p>정보의 기준일과 공식 안내를 함께 확인하면 글을 더 안전하게 활용할 수 있습니다.</p></div></aside><div className="archive-content"><div className="archive-content__heading"><div><span className="section-kicker">{categoryArticles.length ? "읽을거리" : "준비 중인 서랍"}</span><h2>{categoryArticles.length ? `${category.label}에서 고른 글` : "새 글을 준비하고 있습니다"}</h2></div><span className="result-count">{categoryArticles.length}개의 글</span></div>{categoryArticles.length ? <div className="archive-list">{categoryArticles.map((article, index) => <Link key={article.slug} href={`/article/${article.slug}`} className="archive-row"><span className="archive-row__number">{String(index + 1).padStart(2, "0")}</span>{article.image ? <img src={article.image} alt="" /> : <div className="archive-row__placeholder" style={{ "--archive-accent": category.accent } as CSSProperties} /> }<div className="archive-row__copy"><span className="category-label" style={{ "--label-accent": category.accent } as CSSProperties}>{category.label}</span><h3>{article.title}</h3><p>{article.excerpt}</p><div className="article-meta"><span><Clock3 size={14} /> {article.readingTime}</span><span>업데이트 {article.updated}</span></div></div><MoveUpRight className="archive-row__arrow" size={18} /></Link>)}</div> : <div className="empty-shelf"><span className="empty-shelf__mark">+</span><p>이 주제의 첫 글을 차분히 준비하고 있습니다.<br />다른 서랍에서 먼저 읽을거리를 찾아보세요.</p><Link href="/category/welfare" className="text-link">정부지원·복지 둘러보기 <ArrowRight size={16} /></Link></div>}</div></section>
      <section className="archive-bottom container"><span className="section-kicker">다음으로 살펴보기</span><div className="next-category-links">{categories.filter((item) => item.slug !== category.slug).slice(0, 3).map((item) => <Link key={item.slug} href={`/category/${item.slug}`}><span>{item.label}</span><ArrowRight size={16} /></Link>)}</div></section>
    </>
  );
}
