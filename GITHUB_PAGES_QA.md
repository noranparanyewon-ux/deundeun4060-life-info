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
