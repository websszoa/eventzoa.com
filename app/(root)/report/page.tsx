import PageReport from "@/components/page/page-report";
import PageTitle from "@/components/page/page-title";

export const metadata = {
  title: "이벤트조아 제보하기 | EventZoa Report",
  description:
    "잘못된 정보, 신규 이벤트, 개선 사항 등을 이벤트조아에 제보해 주세요.",
};

export default function ReportPage() {
  return (
    <>
      <PageTitle
        subtitle="Report"
        title="제보하기"
        description="신규 이벤트 제보나 잘못된 정보, 개선 사항을 알려주세요."
      />
      <PageReport />
    </>
  );
}
