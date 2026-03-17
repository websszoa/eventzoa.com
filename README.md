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

---

## 📧 신규 가입 관리자 알림 메일 과정

Supabase Webhook + Nodemailer를 통해 신규 유저 가입 시 관리자에게 자동으로 이메일을 발송합니다.

```
─────────────────────────────────────────────────────────────────
  1. 신규 유저 최초 로그인 (Google / Kakao OAuth)
     /auth/callback/route.ts
     → Supabase가 auth.users에 신규 유저 INSERT
─────────────────────────────────────────────────────────────────
                              ▼
─────────────────────────────────────────────────────────────────
  2. DB Trigger 자동 실행
     supabase_function.sql
     → auth.users INSERT 감지
     → public.profiles 테이블에 신규 row INSERT
     (handle_new_user 트리거)
─────────────────────────────────────────────────────────────────
                              ▼
─────────────────────────────────────────────────────────────────
  3. Supabase Database Webhook 발송
     Supabase 대시보드 > Database > Webhooks
     - 테이블: public.profiles
     - 이벤트: INSERT
     - URL: https://[DOMAIN]/api/webhook/new-user
     - Secret: WEBHOOK_SECRET (환경변수)
─────────────────────────────────────────────────────────────────
                              ▼
─────────────────────────────────────────────────────────────────
  4. Next.js API Route 수신
     /api/webhook/new-user/route.ts
     - Authorization 헤더로 WEBHOOK_SECRET 검증
     - 요청 body에서 신규 유저 정보 추출
       (email, full_name, signup_provider, created_at)
─────────────────────────────────────────────────────────────────
                              ▼
─────────────────────────────────────────────────────────────────
  5. Nodemailer로 관리자 메일 발송
     - SMTP: Gmail (App Password 사용)
     - 발신: SMTP_USER (환경변수)
     - 수신: ADMIN_EMAIL (환경변수)
     - 내용: 신규 가입자 정보 (이름, 이메일, 가입 경로, 일시)
─────────────────────────────────────────────────────────────────
                              ▼
─────────────────────────────────────────────────────────────────
  6. 발송 완료
     - 성공: 200 OK 반환
     - 실패: 500 에러 반환 (Supabase Webhook 자동 재시도)
─────────────────────────────────────────────────────────────────
```

### 환경변수 설정

```env
# Webhook 인증 시크릿 (Supabase Webhook 설정과 동일한 값)
WEBHOOK_SECRET=your_webhook_secret

# Gmail SMTP (Google 계정 > 앱 비밀번호 발급)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_gmail_app_password

# 알림 수신 관리자 이메일
ADMIN_EMAIL=admin@example.com
```

### 파일 구성

```text
app/
└── api/
    └── webhook/
        └── new-user/
            └── route.ts     # Webhook 수신 + Nodemailer 발송

lib/
└── mailer.ts                # Nodemailer 트랜스포터 설정
```

### 패키지 설치

```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

### Supabase Webhook 설정 순서

```text
1. Supabase 대시보드 → Database → Webhooks → Create Webhook
2. 이름: notify-admin-new-user
3. 테이블: public.profiles / 이벤트: INSERT
4. URL: https://[DOMAIN]/api/webhook/new-user
5. HTTP Headers: { "Authorization": "Bearer [WEBHOOK_SECRET]" }
6. 저장
```

---

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
