/* 생활 문서 아카이브 / 아이보리 종이 / 잉크 네이비 / 든든한 청록 / 편집 지면형 비대칭 레이아웃 */
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <section className="page-empty container">
      <span className="section-kicker">404 · 찾을 수 없는 페이지</span>
      <h1>이 기록은 아직<br />서랍에 없습니다.</h1>
      <p className="hero-lede">주소가 바뀌었거나 아직 준비되지 않은 글일 수 있습니다. 주제별 보기에서 다른 정보를 찾아보세요.</p>
      <div className="hero-actions"><Link href="/" className="button button--primary"><ArrowLeft size={16} /> 홈으로 돌아가기</Link><Link href="/category/welfare" className="text-link">주제별 보기 <ArrowRight size={16} /></Link></div>
    </section>
  );
}
