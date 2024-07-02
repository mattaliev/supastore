import AuthProvider from "@/components/auth/AuthProvider";
import { StoreProvider } from "@/components/store/store-context";
import TmaSdkLoader from "@/components/telegram/tma-sdk-loader";
import ThemeProvider from "@/components/theme/theme-provider";

const ShopLayout = ({
  children,
  params
}: Readonly<{ children: React.ReactNode; params: { storeId: string } }>) => {
  return (
    <StoreProvider storeId={params.storeId}>
      <TmaSdkLoader>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </TmaSdkLoader>
    </StoreProvider>
  );
};

export default ShopLayout;
