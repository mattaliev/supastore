import type { Metadata } from "next";

import "./globals.css";
import { Inter } from "next/font/google";

import AuthProvider from "@/components/auth/auth-provider";
import { ThemeProvider } from "@/components/theme";
import { EdgeStoreProvider } from "@/lib/edgestore";

const inter = Inter({ subsets: ["latin"] });
// import { Rethink_Sans } from "next/font/google";

// const rethink_sans = Rethink_Sans({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-rethink_sans"
// });

export const metadata: Metadata = {
  title: "DITCH Admin Dashboard",
  description: "View and manage your DITCH store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <EdgeStoreProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              enableColorScheme
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </EdgeStoreProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
