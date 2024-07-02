import TelegramBackButton from "@/components/layout/back-button";
import Footer from "@/components/layout/footer";
import Nav from "@/components/layout/nav";

export default function AppLayout({
  params,
  children
}: {
  params: { storeId: string };
  children: React.ReactNode;
}) {
  return (
    <>
      <TelegramBackButton />
      <Nav storeId={params.storeId} />
      <div className="min-h-screen pb-10">{children}</div>
      <Footer />
    </>
  );
}
