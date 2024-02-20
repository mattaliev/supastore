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
            <Nav />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </TmaSdkLoader>
    </>
  );
};

export default ShopLayout;
