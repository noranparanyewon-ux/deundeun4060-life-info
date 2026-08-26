/* 생활 문서 아카이브 / 아이보리 종이 / 잉크 네이비 / 든든한 청록 / 편집 지면형 비대칭 레이아웃 */
import { FormEvent, useState } from "react";
import { ArrowRight, Clock3, Search as SearchIcon } from "lucide-react";
import { Link, useLocation } from "wouter";
import { articles, getCategory } from "../lib/siteData";
import { SEO } from "../App";

export default function SearchPage() {
  const [location, setLocation] = useLocation();
  const initialQuery = new URLSearchParams(location.split("?")[1] ?? "").get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const normalized = initialQuery.trim().toLowerCase();
  const results = normalized ? articles.filter((article) => `${article.title} ${article.excerpt} ${getCategory(article.category)?.label}`.toLowerCase().includes(normalized)) : articles;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextQuery = query.trim();
    setLocation(nextQuery ? `/search?q=${encodeURIComponent(nextQuery)}` : "/search");
  };

  return (
    <>
      <SEO title={initialQuery ? `‘${initialQuery}’ 검색 결과 | 든든한 4060 생활정보` : `정보 검색 | 든든한 4060 생활정보`} description={initialQuery ? `${initialQuery}와 관련된 든든한 4060 생활정보 글을 찾아봅니다.` : "든든한 4060 생활정보의 전체 글과 주제별 기록을 검색합니다."} />
      <section className="search-hero"><div className="container"><span className="eyebrow"><span className="eyebrow-line" /> 생활 정보 찾기</span><h1>{initialQuery ? `‘${initialQuery}’에 대한 기록` : "필요한 정보를\n천천히 찾아보세요."}</h1><form className="search-large" onSubmit={onSubmit}><SearchIcon size={20} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="예: 스마트폰, 연금, 건강검진" aria-label="검색어" /><button type="submit">검색 <ArrowRight size={16} /></button></form></div></section>
      <section className="search-results container"><div className="search-results__heading"><div><span className="section-kicker">{initialQuery ? "검색 결과" : "전체 기록"}</span><h2>{initialQuery ? `${results.length}개의 글을 찾았습니다` : "지금 읽을 수 있는 글"}</h2></div><span className="result-count">{articles.length}개 등록</span></div>{results.length ? <div className="search-list">{results.map((article, index) => { const category = getCategory(article.category); return <Link key={article.slug} href={`/article/${article.slug}`} className="search-row"><span className="search-row__number">{String(index + 1).padStart(2, "0")}</span><div><span className="category-label" style={{ "--label-accent": category?.accent } as React.CSSProperties}>{category?.label}</span><h3>{article.title}</h3><p>{article.excerpt}</p><span className="article-meta"><Clock3 size={13} /> {article.readingTime} · 업데이트 {article.updated}</span></div><ArrowRight size={17} /></Link>})}</div> : <div className="empty-shelf empty-shelf--search"><span className="empty-shelf__mark">?</span><p>아직 이 검색어가 들어간 글은 없습니다.<br />다른 단어로 다시 찾아보거나, 주제별 서랍을 살펴보세요.</p><Link href="/category/welfare" className="text-link">주제별 보기 <ArrowRight size={16} /></Link></div>}</section>
    </>
  );
}
