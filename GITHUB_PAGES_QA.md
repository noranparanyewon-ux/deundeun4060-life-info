# GitHub Pages 배포 QA 기록

검증일: 2026-08-27 (KST)

## 공개 주소

- 홈: `https://noranparanyewon-ux.github.io/deundeun4060-life-info/`
- 기사 상세: `https://noranparanyewon-ux.github.io/deundeun4060-life-info/welfare/basic-livelihood-living-allowance`

## 확인 결과

| 항목 | 결과 |
|---|---|
| GitHub Actions 배포 | 수동 실행 성공 (`Publish verified scheduled content to GitHub Pages`) |
| 홈 라우팅 | 정상 로드 |
| 하위 기사 정규 경로 | 정상 로드 |
| 공개 콘텐츠 | 12편 공개 데이터 기반 홈·카테고리·글 상세 노출 확인 |
| 예약 콘텐츠 | 공개 화면·검색·사이트맵 생성 대상에서 제외되는 코드·테스트 확인 |
| 저장소 하위 경로 | `/deundeun4060-life-info/` 기준 정적 자산과 내부 링크 정상 확인 |
| 외부 프로젝트 전용 이미지 경로 | 제거 완료. CSS 기반 편집형 시각 요소로 대체 확인 |

## 운영 메모

워크플로는 UTC 00:00 및 09:00에 실행되며, 한국 시간 09:00·18:00 공개 일정에 대응합니다. 실제 개인 도메인을 연결하면 GitHub Actions Variables의 `SITE_URL`과 `VITE_BASE_PATH`를 각각 실제 도메인과 `/`로 바꿔야 합니다.

## 이미지 릴리스 사전 확인

- 현재 공개 12편에 글별 자체 SVG 일러스트와 한국어 대체 텍스트를 연결했습니다.
- GitHub Pages 빌드는 `dist/public/editorial/` 아래 12개 SVG를 포함하며, 번들에는 저장소 기본 경로 `/deundeun4060-life-info/`와 이미지 경로 조합 함수가 포함됩니다.
- 임시 정적 미리보기의 저장소 하위 경로는 빈 화면으로 표시되어, 최종 신뢰 기준은 GitHub Actions 배포 후 실제 Pages 주소의 캐시 우회 확인으로 둡니다.
- 임시 미리보기 서버는 하위 경로 JavaScript 요청에 HTML 대체 응답을 돌려주는 특성이 확인되어, 실제 GitHub Pages 배포 검증을 대체하지 않습니다.
- `verify:github-pages-images` 자동 검증은 12개 SVG가 `/deundeun4060-life-info/editorial/` 아래로 해석되고 `/manus-storage/` 참조가 없음을 확인합니다.
- 이미지 릴리스 워크플로(커밋 `154a42b`)는 성공했습니다.
- 캐시 우회 홈과 `정부지원·복지` 카테고리에서 특집, 최신 글, 목록 카드가 각각의 한국어 대체 텍스트와 `/deundeun4060-life-info/editorial/*.svg` 경로를 사용해 표시되는 것을 확인했습니다.
- 캐시 우회 건강 기사 상세에서 상단 일러스트와 관련 글 2개의 일러스트가 모두 `loaded: true` 상태로 확인되었습니다.
- 캐시 우회 홈에서 특집·최신 글·코너 카드에 사용된 8개의 SVG 요청이 모두 `loaded: true` 상태로 확인되었습니다.
- 캐시 우회 `정부지원·복지` 카테고리에서는 세 글의 서로 다른 썸네일 SVG 요청이 모두 `loaded: true` 상태로 확인되었습니다.

## 월별 대표 특집 표지 개편 사전 확인

- 데스크톱과 모바일에서 세로 이슈 레일, 특집 번호, 이미지, 핵심 제목, 확인 기준, 특집 읽기 동선이 모두 겹침 없이 표시되는 것을 확인했습니다.
- 다음 특집 제어를 선택하면 번호·카테고리·제목·이미지가 두 번째 특집 기사로 함께 전환되는 것을 확인했습니다.
- TypeScript 검사, Vitest 9개 테스트, GitHub Pages 정적 빌드와 정적 이미지 경로 검증을 통과했습니다.
- 월별 대표 특집 표지 개편 워크플로(커밋 `daea036c`)는 성공했으며, 캐시 우회 공개 홈에서 이슈 레일·특집 읽기 동선·대표 SVG 이미지가 모두 렌더링되는 것을 확인했습니다.
