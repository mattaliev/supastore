import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DITCH SHOP",
  description: "Ditch the basics; Wear personality.",
};

export const revalidate = 0;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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

      <body className={inter.className}>{children}</body>
    </html>
  );
}
