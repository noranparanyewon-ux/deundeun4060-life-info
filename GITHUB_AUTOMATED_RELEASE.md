# GitHub·Cloudflare 자동 예약 공개 설정

이 사이트는 **검증을 마친 40개 글** 중 공개일이 지난 글만 정적 빌드에 포함합니다. 공개 예정 글은 브라우저에 내려보내지 않으며, 검색·카테고리·사이트맵에도 들어가지 않습니다.

## 작동 방식

| 시점 | 실행 내용 | 결과 |
|---|---|---|
| 매일 09:00 KST | 공개 시각이 지난 글을 다시 계산하고 사이트맵을 생성 | 해당 글이 공개 목록·검색·정규 URL에 포함 |
| 매일 18:00 KST | 같은 검증 절차를 한 번 더 실행 | 두 번째 공개 시각의 글 반영 |
| `main` 브랜치 변경 또는 수동 실행 | 전체 검증·빌드·배포 | 편집 내용과 공개 정책 반영 |

GitHub Actions의 스케줄은 UTC 기준이므로, 워크플로의 `0 0 * * *`는 한국 시간 09:00, `0 9 * * *`는 한국 시간 18:00입니다. GitHub 스케줄은 지연될 수 있어 공개 시각은 수 분 정도 차이 날 수 있습니다.

## 소유자가 한 번만 설정할 항목

| GitHub 저장소 설정 위치 | 이름 | 값 | 목적 |
|---|---|---|---|
| Settings → Secrets and variables → Actions → **Secrets** | `CLOUDFLARE_API_TOKEN` | Cloudflare 계정 API 토큰 | Pages 배포 인증 |
| 같은 위치 | `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 계정 ID | 배포할 계정 식별 |
| 같은 위치 | `CLOUDFLARE_PROJECT_NAME` | 기존 Direct Upload Pages 프로젝트명 | 배포 대상 지정 |
| Settings → Secrets and variables → Actions → **Variables** | `SITE_URL` | 연결한 최종 도메인. 예: `https://example.kr` | canonical·robots·sitemap 생성 |

Cloudflare API 토큰은 Cloudflare 대시보드의 **Account API Tokens**에서 새 사용자 지정 토큰을 만들고, 계정 권한 **Cloudflare Pages: Edit**를 부여합니다. 프로젝트명은 Workers & Pages의 해당 프로젝트 이름을 그대로 사용합니다. 도메인이 아직 없다면 `SITE_URL`은 임시로 `https://<프로젝트명>.pages.dev`를 넣고, 도메인 연결 뒤 최종 주소로 바꾸면 됩니다.

## 공개 정책 점검

콘텐츠의 공개 시각·공식 출처·정규 경로는 `content/article-manifest.json`에서 관리합니다. 콘텐츠를 고칠 때는 다음 순서로 확인합니다.

1. 공식 원문과 업데이트 날짜를 확인합니다.
2. `pnpm content:verify`를 실행해 출처와 정규 경로를 다시 정리합니다.
3. `pnpm test`, `pnpm check`, `pnpm build:cloudflare`를 실행합니다.
4. `main` 브랜치에 반영하면 다음 배포 또는 예약 실행에서 공개 사이트가 갱신됩니다.

> 자동 공개는 **배포된 정적 사이트만 갱신**합니다. 제도 기준·지원금·기간처럼 자주 바뀌는 정보를 자동으로 새로 조사하거나 수정하지는 않습니다. 해당 정보는 다음 공개 또는 수정 전에 공식 원문으로 다시 점검해야 합니다.

## 공식 참고 문서

1. [Cloudflare Pages: Direct Upload CI](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/)
2. [Cloudflare Pages: Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/)
3. [Cloudflare Wrangler GitHub Action](https://github.com/cloudflare/wrangler-action)
