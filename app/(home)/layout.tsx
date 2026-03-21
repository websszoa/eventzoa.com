import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import NavBottom from "@/components/nav/nav-bottom";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="main__container pb-16">{children}</main>
      <Footer />
      <NavBottom />
    </>
  );
}
