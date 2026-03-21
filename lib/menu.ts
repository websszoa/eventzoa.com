import {
  LucideIcon,
  BellElectric,
  Medal,
  Dessert,
  Home,
  Newspaper,
  Compass,
  Drama,
  User,
  Star,
  Hamburger,
  Gem,
  HandHeart,
  Gamepad2,
  Cable,
  Helicopter,
  Rat,
  Panda,
  Tractor,
  PocketKnife,
  Castle,
  Cake,
  Goal,
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
  { icon: Compass, label: "이용약관", href: "/terms" },
  { icon: Drama, label: "개인정보취급방침", href: "/privacy" },
];

// 로그인 안 했을 때
export const guestMenuItems: MenuItem[] = [
  { icon: Cake, label: "소개", href: "/about" },
  { icon: Goal, label: "내 정보", href: "/profile" },
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
  { icon: HandHeart, label: "소개", href: "/about" },
  { icon: Hamburger, label: "문의사항", href: "/contact" },
];

// 모바일 메뉴
export const mobileMenuItems: MenuItem[] = [
  { icon: Castle, label: "홈", href: "/" },
  { icon: Tractor, label: "공지사항", href: "/notice" },
  { icon: Panda, label: "즐겨찾기", href: "/favorites" },
  { icon: PocketKnife, label: "더보기", href: "#more" },
];

// 관리자 메뉴
export const adminMenuItems: MenuItem[] = [
  { icon: Home, label: "대시보드", href: "/admin" },
  { icon: Gamepad2, label: "문의사항", href: "/admin/contact" },
  { icon: Cable, label: "회원관리", href: "/admin/member" },
  { icon: Helicopter, label: "이벤트", href: "/admin/event" },
];

// 관리자 사용자 메뉴
export const adminUserMenuItems: MenuItem[] = [
  { icon: BellElectric, label: "이벤트조아", href: "https://eventzoa.com" },
  { icon: Dessert, label: "런조아", href: "https://runzoa.com" },
  { icon: Medal, label: "이미지조아", href: "https://imagezoa.com" },
];
