import {
  LucideIcon,
  Home,
  Newspaper,
  Rat,
  Compass,
  Drama,
  LogIn,
  UserPlus,
  Lock,
  User,
  Star,
  Hamburger,
  Ham,
  Projector,
  Gem,
  Cable,
  Gamepad2,
  Helicopter,
} from "lucide-react";

export interface MenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

// 기본 메뉴
export const basicMenuItems: MenuItem[] = [
  { icon: Home, label: "홈", href: "/" },
  { icon: Newspaper, label: "공지사항", href: "/notice" },
  { icon: Rat, label: "문의하기", href: "/contact" },
  { icon: Projector, label: "제보하기", href: "/report" },
  { icon: Compass, label: "이용약관", href: "/terms" },
  { icon: Drama, label: "개인정보취급방침", href: "/privacy" },
];

// 로그인 안 했을 때
export const guestMenuItems: MenuItem[] = [
  { icon: LogIn, label: "로그인", href: "/login" },
  { icon: UserPlus, label: "회원가입", href: "/sign-up" },
  { icon: Lock, label: "비밀번호 찾기", href: "/forgot-password" },
  { icon: Star, label: "즐겨찾기", href: "/favorites" },
];

// 로그인 했을 때
export const userMenuItems: MenuItem[] = [
  { icon: User, label: "내 정보", href: "/profile" },
  { icon: Star, label: "즐겨찾기", href: "/favorites" },
  { icon: Gem, label: "관리자", href: "/admin" },
];

// 푸터 메뉴
export const footerMenuItems: MenuItem[] = [
  { icon: Hamburger, label: "문의사항", href: "/contact" },
  { icon: Ham, label: "제보하기", href: "/submit" },
];

// 모바일 메뉴
export const mobileMenuItems: MenuItem[] = [
  { icon: Home, label: "홈", href: "/" },
  { icon: Newspaper, label: "공지사항", href: "/notice" },
  { icon: Rat, label: "문의하기", href: "/contact" },
  { icon: Compass, label: "더보기", href: "#more" },
];

// 관리자 메뉴
export const adminMenuItems: MenuItem[] = [
  { icon: Home, label: "대시보드", href: "/admin" },
  { icon: Cable, label: "이벤트", href: "/admin/events" },
  { icon: Gamepad2, label: "공지사항", href: "/admin/notice" },
  { icon: Helicopter, label: "제보관리", href: "/admin/report" },
];
