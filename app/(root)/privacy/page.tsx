import PagePrivacy from "@/components/page/page-privacy";
import PageTitle from "@/components/page/page-title";

export const metadata = {
  title: "이벤트조아 개인정보처리방침 | EventZoa Privacy Policy",
  description:
    "이벤트조아 서비스 이용 시 적용되는 개인정보 처리 방침을 안내드립니다.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageTitle
        subtitle="Privacy Policy"
        title="개인정보처리방침"
        description="이벤트조아 서비스 이용 시 적용되는 개인정보처리방침을 안내드립니다."
      />
      <PagePrivacy />
    </>
  );
}
