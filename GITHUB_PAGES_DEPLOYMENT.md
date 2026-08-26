# GitHub Pages 자동 공개 운영 안내

이 사이트는 GitHub Pages와 GitHub Actions만으로 정적 배포합니다. 별도 Cloudflare API 토큰은 필요하지 않습니다.

## 최초 한 번만 할 설정

GitHub 저장소의 **Settings → Pages**에서 `Build and deployment`의 Source를 **GitHub Actions**로 선택합니다. 이후 저장소의 `main` 브랜치에 푸시하거나 워크플로를 수동 실행하면 GitHub Pages가 배포됩니다.

기본 주소는 `https://noranparanyewon-ux.github.io/deundeun4060-life-info/`입니다. 실제 개인 도메인을 연결한 뒤에는 저장소의 **Settings → Secrets and variables → Actions → Variables**에 아래 선택 항목을 추가합니다.

| 변수 | 기본값 | 개인 도메인 연결 후 권장값 |
|---|---|---|
| `SITE_URL` | GitHub Pages 기본 주소 | `https://실제도메인` |
| `VITE_BASE_PATH` | `/deundeun4060-life-info/` | `/` |

`SITE_URL`은 사이트맵, robots.txt, canonical URL 생성에 사용합니다. `VITE_BASE_PATH`는 정적 파일과 SPA 라우팅의 기준 경로입니다.

## 예약 공개 방식

워크플로는 매일 UTC 00:00와 09:00에 실행되며, 이는 한국 시간 09:00와 18:00입니다. 실행 시 공개 시각이 지난 글만 브라우저 콘텐츠, 검색, 카테고리 목록, 사이트맵에 포함됩니다. 12편은 처음부터 공개하고, 나머지 28편은 순서대로 공개합니다.

수동 확인이 필요하면 저장소의 **Actions → Publish verified scheduled content to GitHub Pages → Run workflow**를 실행합니다.

## 운영 주의사항

GitHub Pages는 정적 호스팅이므로 공개 시각이 되어도 해당 예약 실행이 정상 완료돼야 새 글이 실제 사이트에 반영됩니다. 제도·건강·금융 관련 글은 예약 공개 직전에 원문 출처의 날짜, 대상, 신청 경로를 다시 확인하세요.
