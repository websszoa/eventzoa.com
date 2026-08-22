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
