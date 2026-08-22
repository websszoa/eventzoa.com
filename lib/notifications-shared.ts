export const notificationCategories = [
  "festival",
  "notice",
  "update",
  "newsletter",
] as const;

export type NotificationCategory = (typeof notificationCategories)[number];

export const notificationCategoryLabels: Record<NotificationCategory, string> = {
  festival: "축제소식",
  notice: "공지사항",
  update: "업데이트",
  newsletter: "뉴스레터",
};
