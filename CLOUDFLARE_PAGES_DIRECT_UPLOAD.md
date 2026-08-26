# Cloudflare Pages Direct Upload 준비 안내

이 프로젝트는 **정적 React 사이트**이며, Cloudflare Pages에 업로드할 대상은 `dist/public` 폴더입니다. 이 폴더에는 SPA 경로를 위한 `_redirects`, `robots.txt`, `sitemap.xml`, favicon, 번들된 HTML·CSS·JS가 함께 포함됩니다.

## 1. 개인 도메인으로 SEO 파일 만들기

개인 도메인이 연결되기 전에는 기본 주소를 사용해도 되지만, 최종 배포 직전에는 아래처럼 `SITE_URL`에 실제 대표 주소를 넣고 빌드합니다. `https://`를 포함하고, 끝의 `/`는 넣지 않습니다.

```bash
cd /home/ubuntu/deundeun4060-life-info
SITE_URL=https://example.com pnpm package:cloudflare
```

이 명령은 `robots.txt`와 `sitemap.xml`의 모든 URL을 최종 도메인으로 생성한 뒤, Direct Upload용 `deundeun4060-cloudflare-pages.zip` 파일을 만듭니다. ZIP 대신 `dist/public` 폴더 자체를 업로드해도 됩니다.

## 2. Cloudflare Pages에 업로드하기

Cloudflare Dashboard에서 **Workers & Pages → Create application → Get started → Drag and drop your files** 순서로 이동합니다. 프로젝트 이름을 입력한 뒤 생성된 ZIP 또는 `dist/public`의 파일을 올리고 **Deploy site**를 선택합니다. Direct Upload는 미리 빌드된 정적 파일을 업로드하는 방식이며, 대시보드의 드래그 앤 드롭은 ZIP 또는 단일 자산 폴더를 받을 수 있습니다. [1]

`_redirects` 파일의 `/* /index.html 200` 규칙은 개별 글·카테고리 주소를 직접 열었을 때 React 앱이 정상적으로 해당 화면을 표시하도록 넣어둔 SPA fallback입니다. Cloudflare Pages는 정적 자산 디렉터리의 `_redirects` 파일을 배포 규칙으로 해석합니다. [2]

## 3. 개인 도메인 연결하기

Cloudflare Pages 프로젝트의 **Custom domains → Set up a domain**에서 도메인을 추가합니다. 루트 도메인(`example.com`)은 해당 도메인을 Cloudflare zone으로 추가하고 네임서버를 Cloudflare로 변경해야 합니다. 서브도메인(`www.example.com` 등)은 Pages 주소를 가리키는 CNAME 레코드 방식도 사용할 수 있습니다. 도메인을 먼저 Pages 화면에서 연결한 뒤 DNS를 설정해야 합니다. [3]

## 4. Search Console과 AdSense 준비

도메인 연결과 배포가 끝난 뒤 Google Search Console에서 **도메인 속성**을 추가하고 DNS 확인을 완료합니다. 이후 `https://내도메인/sitemap.xml`을 제출합니다. AdSense 심사 전에는 실제 운영 이메일을 문의·개인정보처리방침에 반영하고, 최소한 각 카테고리의 검증된 글을 추가해 빈 카테고리가 없도록 정리합니다.

AdSense 승인을 받은 뒤 제공되는 계정 스크립트는 `client/index.html`의 안내 주석 위치에 삽입합니다. 코드 추가 후에는 같은 `SITE_URL` 값으로 다시 빌드하고 재업로드합니다. 개인별 AdSense 승인 여부는 콘텐츠 품질·정책 준수·사이트 운영 정보 등을 종합적으로 검토하므로 이 배포 구조가 승인을 보장하지는 않습니다.

## 참고 자료

[1] [Cloudflare Pages Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/)

[2] [Cloudflare Pages Redirects](https://developers.cloudflare.com/pages/configuration/redirects/)

[3] [Cloudflare Pages Custom Domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
