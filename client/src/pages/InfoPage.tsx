/* 생활 문서 아카이브 / 아이보리 종이 / 잉크 네이비 / 든든한 청록 / 편집 지면형 비대칭 레이아웃 */
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

type InfoType = "about" | "contact" | "privacy" | "disclaimer";

const content = {
  about: {
    kicker: "우리가 정리하는 기준",
    title: "생활의 질문을\n차분히 정리합니다.",
    intro: "든든한 4060 생활정보는 40~60대와 가족이 복지, 연금, 건강, 생활비, 디지털 활용 정보를 이해하는 데 도움을 주는 생활 정보 아카이브입니다.",
  },
  contact: {
    kicker: "의견을 보내는 곳",
    title: "더 정확한 안내를\n함께 만들어 주세요.",
    intro: "글에서 사실과 다른 부분을 발견했거나, 다음에 다뤘으면 하는 생활 질문이 있다면 운영자가 공식 연락처를 확정한 뒤 이 페이지에 연결해 안내할 예정입니다.",
  },
  privacy: {
    kicker: "개인정보처리방침",
    title: "필요한 만큼만,\n분명하게 다룹니다.",
    intro: "현재 기본 주소에서 운영 중인 초기 버전의 안내문입니다. 실제로 수집하는 정보와 연결하는 분석·광고 서비스가 확정되면 운영 방식에 맞춰 내용을 업데이트해야 합니다.",
  },
  disclaimer: {
    kicker: "면책 안내",
    title: "정보는 출발점이고,\n최종 확인은 공식 안내에서.",
    intro: "이 사이트의 글은 생활 정보 이해를 돕기 위한 일반적인 안내입니다. 개인별 자격, 금액, 진단, 계약 결과를 보장하거나 전문적인 판단을 대신하지 않습니다.",
  },
} as const;

export default function InfoPage({ type }: { type: InfoType }) {
  const current = content[type];
  return (
    <>
      <section className="info-hero"><div className="container info-hero__inner"><span className="eyebrow"><span className="eyebrow-line" /> {current.kicker}</span><h1>{current.title.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h1><p>{current.intro}</p></div></section>
      <section className="info-body container">
        {type === "about" && <>
          <div className="info-grid"><div className="info-lead"><span className="section-kicker">운영 원칙</span><h2>검색보다 한 단계 더,<br />이해할 수 있도록.</h2></div><div className="info-copy"><p>검색 결과를 빠르게 다시 쓰는 대신, 독자가 실제로 궁금해하는 조건과 다음 행동을 먼저 정리합니다. 날짜·금액·자격·정책처럼 바뀔 수 있는 정보는 공식 원문을 우선으로 확인하고, 확인되지 않는 내용은 추측으로 채우지 않습니다.</p><p>이 사이트에는 허위 경험담, 가짜 후기, 존재하지 않는 기관·작성자 정보가 들어가지 않습니다. 글의 내용과 사이트 운영 방식이 달라지면 해당 페이지도 함께 수정합니다.</p></div></div>
          <div className="principle-list"><div><span>01</span><strong>독자에게 필요한 답</strong><p>질문의 핵심을 글 앞부분에서 먼저 설명합니다.</p></div><div><span>02</span><strong>확인 가능한 근거</strong><p>최신 기준은 공식 안내로 이어지도록 구성합니다.</p></div><div><span>03</span><strong>오래 읽는 구조</strong><p>카테고리와 관련 글을 통해 정보를 다시 찾기 쉽게 합니다.</p></div></div>
        </>}
        {type === "contact" && <div className="info-single"><div className="info-icon"><Mail size={25} /></div><span className="section-kicker">문의 안내</span><h2>공식 연락처를 준비 중입니다.</h2><p>현재는 사이트의 콘텐츠 구조를 먼저 정비하는 단계입니다. 운영에 사용할 공식 이메일 주소가 확정되면 스팸과 개인정보 노출을 줄일 수 있도록 이 페이지에 안전한 문의 방법을 연결하겠습니다.</p><p>정정 요청을 보낼 때에는 해당 글의 주소와 문제가 되는 문장을 함께 적고, 주민등록번호·계정 비밀번호·인증번호와 같은 민감한 정보는 보내지 마세요.</p><div className="info-callout"><strong>다음 단계</strong><span>공식 이메일 주소를 확정한 뒤 이 페이지와 푸터의 문의 경로를 함께 업데이트합니다.</span></div></div>}
        {type === "privacy" && <div className="info-single legal-copy"><div className="info-icon"><ShieldCheck size={25} /></div><span className="section-kicker">초기 운영 안내</span><h2>실제 운영 방식에 맞춰 업데이트합니다.</h2><p>현재 이 기본 버전은 별도의 회원가입, 댓글, 문의 입력폼을 제공하지 않습니다. 따라서 방문자가 입력하는 개인정보를 사이트 자체에서 저장하는 기능은 두지 않았습니다.</p><p>향후 문의 폼, 분석 도구, 광고 서비스 등을 추가하면 수집 항목, 이용 목적, 보관 기간, 제3자 제공 여부, 이용자 권리와 문의 방법을 실제 설정에 맞게 다시 작성해야 합니다. 해당 문서는 서비스 연결 전에 검토하고 공개합니다.</p><div className="legal-date"><span>최종 업데이트</span><strong>2026년 8월 26일</strong></div></div>}
        {type === "disclaimer" && <div className="info-single legal-copy"><span className="section-kicker">읽기 전 확인</span><h2>개인 상황에 따라 결과가 달라질 수 있습니다.</h2><p>복지·연금·건강·생활비와 관련된 내용은 개인의 조건, 거주 지역, 신청 시점, 기관의 최신 기준에 따라 달라질 수 있습니다. 이 사이트의 글만으로 신청 가능 여부나 금액을 단정하지 마세요.</p><p>건강 증상이나 치료에 관한 판단은 의료기관과 의료진에게, 법률·세무·금융처럼 전문적인 판단이 필요한 사항은 해당 자격을 가진 전문가와 공식 기관에 확인하시기 바랍니다.</p><p>글에 연결된 외부 사이트의 정책과 운영 상태는 해당 기관이 관리합니다. 링크를 방문할 때는 주소와 보안 연결을 확인하고, 계정 비밀번호나 인증번호를 타인에게 전달하지 마세요.</p><div className="info-callout"><strong>기억할 한 문장</strong><span>이 사이트는 확인의 순서를 돕고, 최종 결정은 최신 공식 안내와 본인의 상황을 기준으로 합니다.</span></div></div>}
      </section>
      <section className="info-next container"><span className="section-kicker">다음으로</span><div><Link href="/">홈으로 돌아가기 <ArrowRight size={16} /></Link><Link href="/category/welfare">주제별 글 읽기 <ArrowRight size={16} /></Link></div></section>
    </>
  );
}
