# 🎉 Eventzoa | 전국 축제·이벤트 통합 플랫폼

## 👨🏼‍💻 목표

- 전국 각지의 **축제·행사 정보를 한눈에 확인**하고,  
  **지역별 / 기간별 / 카테고리별**로 손쉽게 필터링 가능한 **웹 & 모바일 앱**을 제작.

## 🏕️ 핵심 기능

- 행사 리스트 (이름, 지역, 일정, 카테고리, 링크 등)
- 상세 페이지 (주최, 장소, 프로그램, 지도, 사진, 후기 등)
- 관심 행사 즐겨찾기 / 알림 기능
- 캘린더 보기 (월간/주간 일정)
- 반응형 웹 + WebView 기반 모바일 앱

## 🎯 목적

- 축제·이벤트 정보가 흩어져 있는 문제를 해결
- 지역 관광 및 문화 활성화 기여
- 일정 알림, 후기, 지도 등 **참여자 중심의 정보 허브** 구축

---

## 🧩 1. 기획 단계 (Planning)

- 기본 기능 중심: 축제 및 이벤트 일정 확인/검색
- Supabase 데이터 구조 및 화면 플로우 정의
- Next.js + Supabase 기반 MVP 범위 확정

## 🎨 2. 디자인 단계 (Design)

- 따뜻하고 밝은 색감 중심의 UI
- 카드형 리스트와 지도형 보기 병행
- 모바일 우선(Responsive) 기반 설계
- 웹과 앱 간의 일관된 UX 유지

## 💻 3. 개발 단계 (Development)

- **Next.js** 기반 웹사이트, **Expo(WebView)** 기반 앱 동시 개발
- **Supabase**로 CRUD 및 Auth 구현
- **Tailwind + Shadcn UI**로 빠르고 일관된 UI 구성

## 🧪 4. 테스트 단계 (Testing)

- 검색 / 필터 / 상세 페이지 이동 / 지도 로드 확인
- 모바일·PC 반응형 테스트
- API / 지도 / 알림 기능 점검

## 🚀 5. 배포 단계 (Deployment)

- **Vercel**을 통한 웹 자동 배포
- **Expo EAS**로 앱 빌드 (iOS / Android)
- **eventzoa.kr** 도메인 연결 및 환경 변수 설정
- App Store / Play Store 등록 및 SEO 설정 완료

## 🎯 6. 운영 & 업데이트 (Operation)

- 크론 작업으로 축제 일정 자동 갱신
- 접수 시작/마감 알림 스케줄 관리
- 후기, 포토 갤러리, 추천 기능 점진적 확장

---

## 🍳 사용 기술 스택

- [Next.js documentation](https://nextjs.org/docs/app/getting-started)
- [Shadcn UI documentation](https://ui.shadcn.com/docs/installation/next)
- [Supabase documentation](https://supabase.com/docs/reference/javascript/introduction)
- [TailwindCSS documentation](https://tailwindcss.com/docs/installation/using-vite)
- [Lucide Icons](https://lucide.dev/)

---

## ⚙️ Getting Started

### Next.js 프로젝트 생성

```bash
npx create-next-app@latest ./
```

Shadcn

```bash
npx shadcn@latest init
```

supabase

```bash
npm install @supabase/supabase-js @supabase/ssr
```

필요한 기능 추가

```bash
npx shadcn@latest add button
npx shadcn@latest add sheet
npx shadcn@latest add scroll-area
npx shadcn@latest add dialog
npx shadcn@latest add card
npx shadcn@latest add table
npx shadcn@latest add input
npx shadcn@latest add badge
npx shadcn@latest add textarea
npx shadcn@latest add sonner
npx shadcn@latest add separator
npx shadcn@latest add form
npx shadcn@latest add sidebar
npx shadcn@latest add tooltip
npx shadcn@latest add dropdown-menu

npm i @tabler/icons-react

```

.env

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# 네이버 지도 API
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=
NEXT_PUBLIC_NAVER_MAP_CLIENT_SECRET=
```

### Table

```sql
CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY,                      -- 고유 ID
  year INT NOT NULL,                             -- 연도
  month INT NOT NULL,                            -- 월
  region TEXT NOT NULL,                          -- 지역
  name TEXT NOT NULL,                            -- 이벤트명
  slug TEXT UNIQUE NOT NULL,                     -- 슬러그 (URL용 고유 식별자)
  description TEXT,                              -- 설명
  highlights TEXT[],                             -- 주요 포인트 (하이라이트)
  images JSONB,                                  -- 이미지 (대표, 썸네일 등)
  event JSONB,                                   -- 대회 일정 및 정보
  registration JSONB,                            -- 접수 정보 (기간, 사이트, 가격 등)
  programs JSONB,                                -- 프로그램 정보
  location JSONB,                                -- 위치 정보
  hosts JSONB,                                   -- 주최자 정보
  sns JSONB,                                     -- sns 정보
  comment_count INT DEFAULT 0 NOT NULL,          -- 댓글 수
  like_count INT DEFAULT 0 NOT NULL,             -- 좋아요 수
  view_count INT DEFAULT 0 NOT NULL,             -- 조회 수
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE comments (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,                                  -- 고유 ID
  events_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,                   -- 연결된 이벤트 ID
  name TEXT DEFAULT '익명' NOT NULL,                                                 -- 작성자 이름
  content VARCHAR(255) NOT NULL,                                                    -- 댓글 내용
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL                                     -- 작성 시각
);

CREATE TABLE contact (
  id BIGSERIAL PRIMARY KEY,                     -- 고유 ID
  name TEXT NOT NULL,                           -- 이름
  email TEXT NOT NULL,                          -- 이메일
  message TEXT NOT NULL,                        -- 문의 내용
  status TEXT DEFAULT 'pending',                -- 처리 상태
  created_at TIMESTAMPTZ DEFAULT NOW(),         -- 작성 시각
  updated_at TIMESTAMPTZ DEFAULT NOW()          -- 수정 시각
);

UPDATE auth.users
SET raw_user_meta_data =
  jsonb_set(
    raw_user_meta_data,
    '{admin_authenticated}',
    'true',
    true
  )
WHERE id = '501233ea-cd9f-4294-8196-c87d5d1f15bd';

```

### JSON

```json
{
  "name": "",
  "slug": "",
  "description": "",
  "highlights": [""],
  "images": {
    "main": "",
    "sub": [""]
  },
  "event": {
    "start": "",
    "end": "",
    "time": "",
    "price": ""
  },
  "registration": {
    "start": "",
    "end": "",
    "status": "",
    "text": "",
    "site": "",
    "price": {}
  },
  "programs": [""],
  "location": {
    "text": "",
    "latitude": 37.496316,
    "longitude": 126.985287
  },
  "hosts": {
    "organizer": "",
    "operator": "",
    "sponsor": [""],
    "home": "",
    "tel": "",
    "email": ""
  },
  "sns": {
    "instagram": "",
    "kakao": "",
    "youtube": "",
    "blog": ""
  }
}
```

```bash
HomePage (Server Component)
 └─ EventList (Client Component)
      ├─ EventSearchBar (검색 + 보기 방식 버튼)
      ├─ EventNotice (이벤트 개수 표시)
      └─ EventCard (이벤트 카드 1개)
```
