import SideNav from "@/components/layout/side-nav";
import Header from "@/components/layout/header";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <TooltipProvider>
          <SideNav />
          <Header />
          <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:pl-16 mb-8 sm:py-0 md:gap-8">
            {children}
          </div>
        </TooltipProvider>
      </div>
    </>
  );
}
