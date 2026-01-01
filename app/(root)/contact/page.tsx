import PageContact from "@/components/page/page-contact";
import PageTitle from "@/components/page/page-title";

export const metadata = {
  title: "이벤트조아 문의하기 | EventZoa Contact",
  description:
    "이벤트조아 서비스 이용 중 궁금한 점이나 문의 사항을 남겨주세요. 빠르고 정확하게 안내해드립니다.",
};

export default function ContactPage() {
  return (
    <>
      <PageTitle
        subtitle="Contact"
        title="문의하기"
        description="서비스 이용 중 궁금한 점이나 요청 사항을 편하게 남겨주세요."
      />
      <PageContact />
    </>
  );
}
