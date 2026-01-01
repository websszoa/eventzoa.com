import PageNotice from "@/components/page/page-notice";
import PageTitle from "@/components/page/page-title";

export const metadata = {
  title: "이벤트조아 공지사항 | EventZoa Notice",
  description:
    "이벤트조아에서 제공하는 서비스 소식, 업데이트, 신규 이벤트 및 필수 안내사항을 한곳에서 확인하세요.",
};

export default function NoticePage() {
  return (
    <>
      <PageTitle
        subtitle="EventZoa Notice"
        title="이벤트조아 공지사항"
        description="서비스 소식과 이벤트 업데이트를 빠르게 확인하세요."
      />
      <PageNotice />
    </>
  );
}
