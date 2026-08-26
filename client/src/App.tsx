/* 생활 문서 아카이브 / 아이보리 종이 / 잉크 네이비 / 든든한 청록 / 편집 지면형 비대칭 레이아웃 */
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link, Route, Switch, useLocation } from "wouter";
import { ChevronRight, Menu, Search, X } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import ArticlePage from "./pages/ArticlePage";
import InfoPage from "./pages/InfoPage";
import SearchPage from "./pages/SearchPage";
import NotFound from "./pages/NotFound";
import { siteDescription, siteName } from "./lib/siteData";

const pageMeta: Record<string, { title: string; description: string }> = {
  "/": { title: siteName, description: siteDescription },
  "/about": { title: `사이트 소개 | ${siteName}`, description: "든든한 4060 생활정보가 어떤 기준으로 생활 정보를 정리하는지 안내합니다." },
  "/contact": { title: `문의 | ${siteName}`, description: "든든한 4060 생활정보에 의견과 정정 요청을 보내는 방법을 안내합니다." },
  "/privacy": { title: `개인정보처리방침 | ${siteName}`, description: "든든한 4060 생활정보의 개인정보 처리 원칙을 안내합니다." },
  "/disclaimer": { title: `면책 안내 | ${siteName}`, description: "정보 이용 전 확인해야 할 범위와 주의사항을 안내합니다." },
  "/404": { title: `페이지를 찾을 수 없음 | ${siteName}`, description: "요청한 주소를 찾을 수 없습니다. 든든한 4060 생활정보의 홈과 주제별 글을 확인해 보세요." },
};

export function SEO({ title, description }: { title?: string; description?: string }) {
  const [location] = useLocation();
  useEffect(() => {
    const normalizedPath = location.split("?")[0];
    const fallback = pageMeta[normalizedPath] ?? { title: siteName, description: siteDescription };
    const resolvedTitle = title ?? fallback.title;
    const resolvedDescription = description ?? fallback.description;
    document.title = resolvedTitle;
    document.documentElement.lang = "ko";

    const setMeta = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.head.querySelector<HTMLMetaElement>(selector);
      if (!element) {
        element = document.createElement("meta");
        if (property) element.setAttribute("property", name);
        else element.setAttribute("name", name);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    setMeta("description", resolvedDescription);
    setMeta("og:title", resolvedTitle, true);
    setMeta("og:description", resolvedDescription, true);
    setMeta("og:type", "website", true);
    setMeta("og:url", `${window.location.origin}${normalizedPath}`, true);
    setMeta("twitter:card", "summary_large_image");

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${window.location.origin}${normalizedPath}`;
  }, [description, location, title]);
  return null;
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location]);
  return null;
}

function SiteMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="site-mark" aria-label={`${siteName} 홈으로 이동`}>
      <svg className="site-mark__logo" viewBox="0 0 48 48" role="img" aria-label="책갈피와 방패를 결합한 든든한 4060 생활정보 심볼">
        <path d="M9 7.5A3.5 3.5 0 0 1 12.5 4H35a4 4 0 0 1 4 4v27.5a2.5 2.5 0 0 1-4 2L24 30.2 13 37.5a2.5 2.5 0 0 1-4-2V7.5Z" fill="#0F766E" />
        <path d="M15 11h18v21.4l-9-5.8-9 5.8V11Z" fill="#F7F4EC" opacity=".94" />
        <path d="M19.2 15.8h9.6M19.2 20.4h7.1" stroke="#20333B" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <span className="site-mark__type">
        <strong>든든한</strong>
        {!compact && <span>4060 생활정보</span>}
      </span>
    </Link>
  );
}

function Header() {
  const [location, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed) setLocation(`/search?q=${encodeURIComponent(trimmed)}`);
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    document.body.classList.toggle("mobile-menu-open", menuOpen);
    return () => document.body.classList.remove("mobile-menu-open");
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <SiteMark />
        <nav className={`main-nav ${menuOpen ? "main-nav--open" : ""}`} aria-label="주요 메뉴">
          <div className="main-nav__primary">
            <Link href="/" onClick={closeMenu} className={location === "/" ? "is-active" : ""}>홈</Link>
            <Link href="/category/welfare" onClick={closeMenu} className={location === "/category/welfare" ? "is-active" : ""}>복지</Link>
            <Link href="/category/pension" onClick={closeMenu} className={location === "/category/pension" ? "is-active" : ""}>연금</Link>
            <Link href="/category/health" onClick={closeMenu} className={location === "/category/health" ? "is-active" : ""}>건강</Link>
            <Link href="/category/saving" onClick={closeMenu} className={location === "/category/saving" ? "is-active" : ""}>생활비</Link>
            <Link href="/category/digital" onClick={closeMenu} className={location === "/category/digital" ? "is-active" : ""}>디지털</Link>
            <Link href="/about" onClick={closeMenu} className={location === "/about" ? "is-active" : ""}>사이트 소개</Link>
          </div>
          <div className="mobile-menu-panel">
            <div className="mobile-menu-panel__intro"><span>빠른 메뉴</span><strong>필요한 정보를<br />바로 찾아보세요.</strong></div>
            <form className="mobile-menu-search" onSubmit={onSearch} role="search"><Search size={19} aria-hidden="true" /><input aria-label="메뉴에서 사이트 글 검색" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="예: 연금, 건강검진, 스마트폰" /><button type="submit">찾기</button></form>
            <div className="mobile-menu-group"><span>주제별 정보</span><Link href="/" onClick={closeMenu}><i>00</i>홈 <ChevronRight size={17} /></Link><Link href="/category/welfare" onClick={closeMenu}><i>01</i>정부지원·복지 <ChevronRight size={17} /></Link><Link href="/category/pension" onClick={closeMenu}><i>02</i>연금·노후준비 <ChevronRight size={17} /></Link><Link href="/category/health" onClick={closeMenu}><i>03</i>건강생활 <ChevronRight size={17} /></Link><Link href="/category/saving" onClick={closeMenu}><i>04</i>생활비 절약 <ChevronRight size={17} /></Link><Link href="/category/digital" onClick={closeMenu}><i>05</i>스마트폰·디지털 활용 <ChevronRight size={17} /></Link></div>
            <div className="mobile-menu-group mobile-menu-group--guide"><span>사이트 안내</span><Link href="/about" onClick={closeMenu}>우리가 정리하는 기준 <ChevronRight size={17} /></Link><Link href="/contact" onClick={closeMenu}>문의와 정정 요청 <ChevronRight size={17} /></Link><Link href="/privacy" onClick={closeMenu}>개인정보처리방침 <ChevronRight size={17} /></Link><Link href="/disclaimer" onClick={closeMenu}>이용안내 및 면책조항 <ChevronRight size={17} /></Link></div>
          </div>
        </nav>
        <div className="header-actions">
          <form className="header-search" onSubmit={onSearch} role="search">
            <Search size={17} aria-hidden="true" />
            <input aria-label="사이트 글 검색" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="필요한 정보 찾기" />
          </form>
          <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid container">
        <div>
          <SiteMark />
          <p className="footer-note">40~60대를 위한 생활 참고서.<br />필요한 정보를 차분히, 확인 가능한 기준으로 정리합니다.</p>
        </div>
        <div className="footer-links">
          <span className="footer-label">둘러보기</span>
          <Link href="/category/welfare">정부지원·복지</Link>
          <Link href="/category/pension">연금·노후준비</Link>
          <Link href="/category/digital">디지털 활용</Link>
        </div>
        <div className="footer-links">
          <span className="footer-label">안내</span>
          <Link href="/about">사이트 소개</Link>
          <Link href="/contact">문의</Link>
          <Link href="/privacy">개인정보처리방침</Link>
          <Link href="/disclaimer">면책 안내</Link>
        </div>
      </div>
      <div className="footer-bottom container">
        <span>© 2026 든든한 4060 생활정보</span>
        <span>기본 웹 주소에서 먼저 운영하고 있습니다.</span>
      </div>
    </footer>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/category/:slug" component={CategoryPage} />
      <Route path="/article/:slug" component={ArticlePage} />
      <Route path="/search" component={SearchPage} />
      <Route path="/about" component={() => <InfoPage type="about" />} />
      <Route path="/contact" component={() => <InfoPage type="contact" />} />
      <Route path="/privacy" component={() => <InfoPage type="privacy" />} />
      <Route path="/disclaimer" component={() => <InfoPage type="disclaimer" />} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <ScrollToTop />
          <SEO />
          <Toaster />
          <Shell><Router /></Shell>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
