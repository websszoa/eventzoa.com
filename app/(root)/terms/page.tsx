import PageTerms from "@/components/page/page-terms";
import PageTitle from "@/components/page/page-title";

export const metadata = {
  title: "이벤트조아 서비스 이용약관 | EventZoa Terms of Service",
  description: "이벤트조아 서비스 이용에 필요한 약관 내용을 안내드립니다.",
};

export default function TermsPage() {
  return (
    <>
      <PageTitle
        subtitle="EventZoa Terms"
        title="이용약관 안내"
        description="안전하고 편리한 이벤트 서비스 이용을 위해 약관 내용을 확인해 주세요."
      />
      <PageTerms />
    </>
  );
}
