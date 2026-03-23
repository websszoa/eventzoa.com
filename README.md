# 이벤트조아 (EventZoa)

전국의 축제와 행사를 한곳에서 확인할 수 있는 통합 플랫폼입니다.

## Getting Started

### 프로젝트 설치

```bash
npx create-next-app@latest ./                       # Next.js 프로젝트 생성
npm install @supabase/supabase-js @supabase/ssr     # Supabase 클라이언트 & Supabase SSR 지원
npm install next-themes                             # 다크모드 테마 지원
npm install react-hook-form zod @hookform/resolvers

npx shadcn@latest init                              # shadcn/ui 초기화
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
npx shadcn@latest add field
npx shadcn@latest add dropdown-menu
npx shadcn@latest add select
npx shadcn@latest add card
npx shadcn@latest add popover
npx shadcn@latest add tabs

npm install resend    # 이메일 보내기
```

### 폰트 사이즈

```
100 font-thin
200 font-extralight
300 font-light
400 font-normal
500 font-medium
600 font-semibold
700 font-bold
800 font-extrabold
900 font-black
```

---

## 🔐 구글 로그인 과정

OAuth 2.0을 통한 구글 소셜 로그인 프로세스입니다.

```
─────────────────────────────────────────────────────────────────
  1. 구글 로그인 버튼 클릭
     google-login-button.tsx
     → supabase.auth.signInWithOAuth({ provider: "google" })
     redirectTo: /auth/callback
─────────────────────────────────────────────────────────────────
                              ▼
─────────────────────────────────────────────────────────────────
  2. 구글 인증 페이지로 리다이렉트
     Google OAuth 동의 화면
     사용자가 구글 계정 선택 및 권한 승인
─────────────────────────────────────────────────────────────────
                              ▼
─────────────────────────────────────────────────────────────────
  3. Supabase 콜백 URL로 리다이렉트
     https://[PROJECT].supabase.co/auth/v1/callback
     Supabase가 인증 코드(code)를 받아 처리
─────────────────────────────────────────────────────────────────
                              ▼
─────────────────────────────────────────────────────────────────
  4. 앱 콜백 처리
     /auth/callback/route.ts
     - code → session 교환
     - 성공: / (홈) 리다이렉트
     - 실패: /?error=... 리다이렉트
─────────────────────────────────────────────────────────────────
                              ▼
─────────────────────────────────────────────────────────────────
  5. 로그인 완료
     세션이 생성되어 자동 로그인
     사용자 정보는 Supabase에서 관리
─────────────────────────────────────────────────────────────────
```

---

## 🟢 네이버 로그인 과정

네이버는 Supabase 기본 OAuth 제공자가 아니므로 직접 OAuth 흐름을 구현합니다.
참고: https://developers.naver.com/docs/login/devguide/devguide.md

```
─────────────────────────────────────────────────────────────────
  1. 네이버 로그인 버튼 클릭
     naver-login-button.tsx
     → /api/auth/naver 로 요청
     → 네이버 OAuth URL 생성 (state 값 포함, CSRF 방지)
     → 네이버 로그인 페이지로 리다이렉트
─────────────────────────────────────────────────────────────────
                              ▼
─────────────────────────────────────────────────────────────────
  2. 네이버 인증 페이지
     사용자가 네이버 계정 선택 및 권한 승인
     → 콜백 URL로 code, state 파라미터 전달
─────────────────────────────────────────────────────────────────
                              ▼
─────────────────────────────────────────────────────────────────
  3. 콜백 처리 - 토큰 교환
     /api/auth/naver/callback/route.ts
     - code → 네이버 accessToken 교환
     - accessToken → 네이버 사용자 정보 요청
     - 이메일, 이름, 프로필 이미지 수신
─────────────────────────────────────────────────────────────────
                              ▼
─────────────────────────────────────────────────────────────────
  4. Supabase 유저 생성 / 세션 발급
     - 기존 유저: 이메일로 조회 후 세션 발급
     - 신규 유저: supabase.auth.admin.createUser() 로 직접 생성
                 (SUPABASE_SERVICE_ROLE_KEY 사용)
     → Supabase 세션 수동 발급 후 쿠키 설정
─────────────────────────────────────────────────────────────────
                              ▼
─────────────────────────────────────────────────────────────────
  5. 로그인 완료
     - 홈(/) 으로 리다이렉트
     - 이후 구글·카카오 로그인과 동일하게 세션 동작
─────────────────────────────────────────────────────────────────
```

### 필요한 파일

```text
app/
├── api/auth/naver/route.ts              # 네이버 OAuth URL 생성 및 리다이렉트
└── api/auth/naver/callback/route.ts     # 토큰 교환 + 유저 생성 + 세션 발급
components/auth/
└── naver-login-button.tsx               # 네이버 로그인 버튼
```

### 환경변수 추가

```
NAVER_CLIENT_ID=...
NAVER_CLIENT_SECRET=...
```

> 네이버 개발자센터 (developers.naver.com) 에서 앱 등록 후 발급

---

## 🗑️ 회원 탈퇴 과정

Soft Delete 방식을 사용한 안전한 회원 탈퇴 프로세스입니다.

```
─────────────────────────────────────────────────────────────────
  1. 탈퇴하기 버튼 클릭
     page-profile.tsx
     → DialogDeleteAccount 다이얼로그 열기
─────────────────────────────────────────────────────────────────
                              ▼
─────────────────────────────────────────────────────────────────
  2. 탈퇴 확인 다이얼로그 표시
     dialog-delete-account.tsx
     - 탈퇴 안내 메시지 표시
     - "탈퇴하기" 버튼 클릭 대기
─────────────────────────────────────────────────────────────────
                              ▼
─────────────────────────────────────────────────────────────────
  3. RPC 함수 호출
     supabase.rpc("soft_delete_account")
     → PostgreSQL 함수 실행 요청
─────────────────────────────────────────────────────────────────
                              ▼
─────────────────────────────────────────────────────────────────
  4. 데이터베이스 함수 실행
     sql/supabase_function.sql
     public.soft_delete_account()
     - profiles 테이블에서 현재 사용자 조회
     - is_deleted = TRUE 설정
     - deleted_at = NOW() 기록
     (실제 데이터 삭제 X, Soft Delete)
─────────────────────────────────────────────────────────────────
                              ▼
─────────────────────────────────────────────────────────────────
  5. 탈퇴 완료 처리
     - 성공 토스트 메시지 표시
     - 로그아웃 처리 (logout())
     - 홈 페이지(/)로 리다이렉트
─────────────────────────────────────────────────────────────────
                              ▼
─────────────────────────────────────────────────────────────────
  6. 탈퇴 계정 차단
     - 이후 로그인 시도 시
     /auth/callback/route.ts에서
     is_deleted = TRUE 확인 후
     자동 로그아웃 및 /auth/deleted로 리다이렉트
─────────────────────────────────────────────────────────────────
```

## SQL 정리

현재 `sql` 폴더는 이벤트 기준 스키마로 정리되어 있습니다.

### 파일 구성

```text
sql/
├── supabase_profiles.sql         # 프로필 테이블 + RLS
├── supabase_contacts.sql         # 문의 테이블 + RLS
├── supabase_events.sql           # 이벤트 메인 테이블 + RLS
├── supabase_event_comments.sql   # 이벤트 댓글 테이블 + RLS
├── supabase_event_favorites.sql  # 이벤트 즐겨찾기 + 트리거 + RPC
├── supabase_event_likes.sql      # 이벤트 좋아요 + 트리거 + RPC
├── supabase_event_shares.sql     # 이벤트 공유 기록 + 트리거 + RPC
├── supabase_event_alerts.sql     # 이벤트 알림 설정 + 트리거 + RPC
└── supabase_function.sql         # 공통 트리거/RPC 함수
```

### 주요 테이블

- `public.profiles`
- `public.contacts`
- `public.events`
- `public.event_comments`
- `public.event_favorites`
- `public.event_likes`
- `public.event_shares`
- `public.event_alerts`

### 카운트 연동

- 댓글 추가/삭제 → `events.comment_count`
- 즐겨찾기 추가/삭제 → `events.favorite_count`
- 좋아요 추가/삭제 → `events.like_count`
- 공유 추가 → `events.share_count`
- 알림 추가 → `events.alert_entry_count`, `events.alert_event_count`

### 주요 RPC

- `public.soft_delete_account()`
- `public.is_full_name_available(name_text TEXT)`
- `public.is_my_account_deleted()`
- `public.increment_visit_count()`
- `public.increment_view_count(p_event_id UUID)`
- `public.toggle_favorite(p_event_id UUID)`
- `public.toggle_like(p_event_id UUID)`
- `public.add_share(p_event_id UUID)`
- `public.add_alert(p_event_id UUID, p_alert_type TEXT)`

### 권장 실행 순서

```text
1. sql/supabase_profiles.sql
2. sql/supabase_contacts.sql
3. sql/supabase_events.sql
4. sql/supabase_event_comments.sql
5. sql/supabase_event_favorites.sql
6. sql/supabase_event_likes.sql
7. sql/supabase_event_shares.sql
8. sql/supabase_event_alerts.sql
9. sql/supabase_function.sql
```

---

## 기타 등록 사항

---

### Google Search Console 등록

- DNS 레코드를 통해 도메인 소유권 확인

### Supabase URL Configuration

- Site URL

```
https://eventzoa.com
```

- Redirect URLs

```
http://localhost:3000/**
https://eventzoa.com/auth/callback
https://www.eventzoa.com/auth/callback
```

### 네이버 맵 API 등록

- https://auth.ncloud.com/ 회원가입 및 로그인
