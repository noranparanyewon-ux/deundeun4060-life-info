import { ArrowUpRight, Clock3, ExternalLink, Share2 } from "lucide-react";
import { Link, useRoute } from "wouter";
import { SEO } from "../App";
import { getLegacyDigitalArticle } from "../lib/siteData";

export default function LegacyDigitalPage() {
  const [, params] = useRoute<{ slug: string }>("/archive/digital/:slug");
  const article = getLegacyDigitalArticle(params?.slug ?? "");

  if (!article) {
    return <section className="page-empty container"><span className="section-kicker">보존 자료를 찾을 수 없습니다</span><h1>주소를 확인해 주세요.</h1><Link href="/" className="button button--primary">홈으로 돌아가기 <ArrowUpRight size={17} /></Link></section>;
  }

  return <>
    <SEO title={`${article.title} | 기존 디지털 자료 | 든든한 4060 생활정보`} description={article.excerpt} canonicalPath={article.canonicalPath} />
    <article className="article-page">
      <div className="container breadcrumb"><Link href="/">홈</Link><span>/</span><span>기존 디지털 자료</span><span>/</span><span>본문</span></div>
      <header className="article-header container"><div className="article-header__main"><span className="category-label" style={{ "--label-accent": "#466B76" } as React.CSSProperties}>기존 디지털 자료</span><h1>{article.title}</h1><p className="article-excerpt">{article.excerpt}</p><div className="article-meta article-meta--large"><span><Clock3 size={15} /> {article.readingTime}</span><span>업데이트 {article.updated}</span><span className="verified-meta">보존 자료</span></div></div><div className="article-header__image"><img src={article.image} alt="" /></div></header>
      <div className="container article-layout"><aside className="article-aside"><div className="article-aside__sticky"><span className="section-kicker">이 글의 순서</span><ol>{article.sections.map((section, index) => <li key={section.heading}><a href={`#section-${index + 1}`}>{section.heading}</a></li>)}</ol><button type="button" className="share-button" onClick={() => { if (navigator.share) navigator.share({ title: article.title, url: window.location.href }); else navigator.clipboard?.writeText(window.location.href); }}><Share2 size={15} /> 링크 저장하기</button></div></aside><div className="article-content"><p className="article-lede">{article.intro}</p>{article.sections.map((section, index) => <section className="article-section" id={`section-${index + 1}`} key={section.heading}><h2><span>{String(index + 1).padStart(2, "0")}</span>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></section>)}<section className="article-reference"><span className="section-kicker">함께 확인할 공식 안내</span><h2>기기별 설정은 원문도 함께 살펴보세요.</h2><div className="reference-links">{article.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label}<ExternalLink size={15} /></a>)}</div></section><p className="source-note">참고 안내: <a href={article.source.href} target="_blank" rel="noreferrer">{article.source.label}</a>의 공식 안내를 함께 확인하세요.</p></div></div>
    </article>
  </>;
}
