```bash
# 1. Next.js 프로젝트 생성
npx create-next-app@latest ./

# 2. shadcn/ui 초기화
npx shadcn@latest init

# 3. 폼 처리 & 유효성 검사
npm install react-hook-form zod @hookform/resolvers

# MDX 콘텐츠
npm install next-mdx-remote remark-gfm gray-matter

# 4. Supabase (데이터베이스 & 인증)
npm install @supabase/supabase-js @supabase/ssr

# 5. 이메일 발송
npm install resend
```

## 알림 MDX 작성

알림 페이지의 글은 `content/notifications` 폴더에 `.mdx` 파일로 작성합니다.
파일명은 글 주소에 사용되는 slug가 되며, 파일을 추가하면 알림 목록에 자동으로
노출됩니다.

```mdx
---
title: "글 제목"
category: "festival"
excerpt: "목록에 표시할 짧은 설명"
publishedAt: "2026-08-22"
featured: false
---

본문을 **MDX 문법**으로 작성합니다.

## 소제목

- 목록
- 표와 링크
- 인용문 등을 사용할 수 있습니다.
```

사용 가능한 `category` 값은 다음과 같습니다.

- `festival`: 축제소식
- `notice`: 공지사항
- `update`: 업데이트
- `newsletter`: 뉴스레터

`featured`는 선택 항목이며 `true`로 지정하면 해당 분류의 대표 글로 표시됩니다.
읽는 시간은 본문 분량을 기준으로 자동 계산됩니다.

```bash
# 컴포넌트 추가
npx shadcn@latest add button
npx shadcn@latest add sonner
npx shadcn@latest add sheet
npx shadcn@latest add scroll-area
npx shadcn@latest add separator
npx shadcn@latest add textarea
npx shadcn@latest add input
npx shadcn@latest add badge
npx shadcn@latest add dialog
npx shadcn@latest add checkbox
npx shadcn@latest add sidebar
npx shadcn@latest add input-otp
npx shadcn@latest add table
npx shadcn@latest add avatar
npx shadcn@latest add dropdown-menu
npx shadcn@latest add select
npx shadcn@latest add card
npx shadcn@latest add popover
npx shadcn@latest add tabs
npx shadcn@latest add field
```

## Vercel 배포 설정

Vercel 프로젝트의 Settings → Environment Variables에 다음 값을 설정합니다.

- `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID`: 네이버 Dynamic Map 공개 클라이언트 ID
- `SUPABASE_URL`: 문의 테이블이 있는 Supabase 프로젝트 URL. 생략하면
  `NEXT_PUBLIC_SUPABASE_URL`을 사용합니다.
- `SUPABASE_SECRET_KEY`: 문의 저장용 서버 전용 `sb_secret_...` 키
- `SUPABASE_SERVICE_ROLE_KEY`: 기존 프로젝트에서 Secret key 대신 사용할 수 있는
  레거시 서버 전용 키
- `RESEND_API_KEY`: 회원가입 및 문의 접수 관리자 알림용 Resend API 키
- `RESEND_FROM_EMAIL`: 선택 사항. Resend에서 인증한 발신 주소

서버 전용 키에는 `NEXT_PUBLIC_` 접두사를 붙이지 않으며 클라이언트 코드에
노출하지 않습니다. 두 서버 키 중 하나만 설정하면 됩니다. 네이버 클라우드 콘솔의 Web Service URL에는 운영
도메인 `https://www.eventzoa.com`과 필요한 Vercel Preview 도메인을 등록합니다.

## 배포 후 검색 노출 점검

1. Vercel에서 `www.eventzoa.com`을 Production 도메인으로 연결합니다.
2. `eventzoa.com`은 `www.eventzoa.com`으로 영구 리디렉션합니다.
3. `/robots.txt`, `/sitemap.xml`, `/llms.txt`가 200 응답인지 확인합니다.
4. Google Search Console과 네이버 서치어드바이저에 사이트 소유권을 등록합니다.
5. `https://www.eventzoa.com/sitemap.xml`을 두 검색도구에 제출합니다.
6. 대표 축제 상세 URL을 Google 리치 결과 테스트로 검사합니다.
