import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DITCH SHOP",
  description: "Ditch the basics; Wear personality."
};

export const revalidate = 0;

export default async function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content={metadata.description ? metadata.description : ""}
        />
        <title>DITCH SHOP</title>
        {process.env.NODE_ENV === "development" && (
          <>
            <script src="https://cdn.jsdelivr.net/npm/eruda"></script>
            <script>eruda.init();</script>
          </>
        )}
      </head>

      <body className={inter.className + "min-h-screen"}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
