/* 생활 문서 아카이브 / 아이보리 종이 / 잉크 네이비 / 든든한 청록 / 편집 지면형 비대칭 레이아웃 */
import { ArrowLeft, ArrowUpRight, Clock3, ExternalLink, Share2 } from "lucide-react";
import { Link, useRoute } from "wouter";
import { articles, getArticle, getCategory } from "../lib/siteData";
import { SEO } from "../App";

export default function ArticlePage() {
  const [, legacyParams] = useRoute<{ slug: string }>("/article/:slug");
  const [, canonicalParams] = useRoute<{ category: string; slug: string }>("/:category/:slug");
  const requestedSlug = legacyParams?.slug ?? canonicalParams?.slug ?? "";
  const matchedArticle = getArticle(requestedSlug);
  const article = canonicalParams && matchedArticle?.category !== canonicalParams.category ? undefined : matchedArticle;
  const category = article ? getCategory(article.category) : undefined;

  if (!article || !category) {
    return <section className="page-empty container"><span className="section-kicker">글을 찾을 수 없습니다</span><h1>주소를 확인해 주세요.</h1><Link href="/" className="button button--primary">홈으로 돌아가기 <ArrowUpRight size={17} /></Link></section>;
  }

  const related = articles.filter((item) => item.category === article.category && item.slug !== article.slug).slice(0, 2);

  return (
    <>
      <SEO title={`${article.title} | 든든한 4060 생활정보`} description={article.excerpt} canonicalPath={article.canonicalPath} />
      <article className="article-page">
      <div className="container breadcrumb"><Link href="/">홈</Link><span>/</span><Link href={`/category/${category.slug}`}>{category.label}</Link><span>/</span><span>본문</span></div>
      <header className="article-header container"><div className="article-header__main"><span className="category-label" style={{ "--label-accent": category.accent } as React.CSSProperties}>{category.label}</span><h1>{article.title}</h1><p className="article-excerpt">{article.excerpt}</p><div className="article-meta article-meta--large"><span><Clock3 size={15} /> {article.readingTime}</span><span>업데이트 {article.updated}</span><span className="verified-meta">공식 안내 확인</span></div></div>{article.image && <div className="article-header__image"><img src={article.image} alt="" /></div>}</header>
      <div className="container article-layout"><aside className="article-aside"><div className="article-aside__sticky"><span className="section-kicker">이 글의 순서</span><ol>{article.sections.map((section, index) => <li key={section.heading}><a href={`#section-${index + 1}`}>{section.heading}</a></li>)}</ol><button type="button" className="share-button" onClick={() => { if (navigator.share) navigator.share({ title: article.title, url: window.location.href }); else navigator.clipboard?.writeText(window.location.href); }}><Share2 size={15} /> 링크 저장하기</button></div></aside><div className="article-content"><p className="article-lede">{article.intro}</p>{article.sections.map((section, index) => <section className="article-section" id={`section-${index + 1}`} key={section.heading}><h2><span>{String(index + 1).padStart(2, "0")}</span>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}</section>)}{article.links && <section className="article-reference"><span className="section-kicker">함께 확인할 공식 안내</span><h2>최신 기준은 원문에서 다시 살펴보세요.</h2><div className="reference-links">{article.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label}<ExternalLink size={15} /></a>)}</div></section>}{article.source && <p className="source-note">참고 안내: <a href={article.source.href} target="_blank" rel="noreferrer">{article.source.label}</a> 공식 홈페이지를 기준으로 추가 확인할 수 있습니다. 제도와 상황에 따라 내용이 달라질 수 있으므로, 신청 전 최신 원문을 확인하세요.</p>}</div></div>
      {related.length > 0 && <section className="related-section container"><div className="section-heading-row"><div><span className="section-kicker">이 서랍에서 더 읽기</span><h2>다음으로 이어지는 글</h2></div><Link href={`/category/${category.slug}`} className="section-link">주제 전체 보기 <ArrowLeft size={16} /></Link></div><div className="related-grid">{related.map((item) => <Link key={item.slug} href={item.canonicalPath} className="related-card">{item.image && <img src={item.image} alt="" />}<div><span className="category-label" style={{ "--label-accent": category.accent } as React.CSSProperties}>{category.label}</span><h3>{item.title}</h3><p>{item.excerpt}</p><span className="read-more">읽어보기 <ArrowUpRight size={15} /></span></div></Link>)}</div></section>}
      </article>
    </>
  );
}
