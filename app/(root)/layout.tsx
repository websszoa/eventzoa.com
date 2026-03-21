import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import NavBottom from "@/components/nav/nav-bottom";

export default function RootLayout({
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
