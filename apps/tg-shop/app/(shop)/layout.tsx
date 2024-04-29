import TelegramBackButton from "@/components/layout/back-button";
import Footer from "@/components/layout/footer";
import Nav from "@/components/layout/nav";
import TmaSdkLoader from "@/components/telegram/tma-sdk-loader";
import ThemeProvider from "@/components/theme/theme-provider";
import AuthProvider from "@/components/user/user-register";

const ShopLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <TmaSdkLoader>
        <ThemeProvider>
          <AuthProvider>
            <TelegramBackButton />
            <Nav />
            <div className="min-h-screen pb-10">{children}</div>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </TmaSdkLoader>
    </>
  );
};

export default ShopLayout;
