import Header from "@/components/layout/header";
import SideNav from "@/components/layout/side-nav";
import { StoreProvider } from "@/components/store/store-context";
import { TooltipProvider } from "@/components/ui/tooltip";

type DashboardLayoutProps = {
  params: {
    storeId: string;
  };
  children: React.ReactNode;
};

export default function DashboardLayout({
  children,
  params: { storeId }
}: DashboardLayoutProps) {
  return (
    <>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <StoreProvider storeId={storeId}>
          <TooltipProvider>
            <SideNav />
            <Header />
            <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:pl-16 mb-8 sm:py-0 md:gap-8">
              {children}
            </div>
          </TooltipProvider>
        </StoreProvider>
      </div>
    </>
  );
}
