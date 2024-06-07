import type { Metadata } from "next";

import "../globals.css";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import AuthProvider from "@/components/auth/auth-provider";
import { ThemeProvider } from "@/components/theme";
import { EdgeStoreProvider } from "@/lib/edgestore";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Supastore",
  description: "Create your first store in Telegram in just a few minutes"
};

export default async function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <NextIntlClientProvider messages={messages}>
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
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
