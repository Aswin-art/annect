import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import Head from "next/head";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Annect",
  description:
    "Event Akademic Untuk Pelajar Mahasiswa Maupun Siswa di Seluruh Indonesia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" suppressHydrationWarning>
        <Script
          id="chatbase"
          dangerouslySetInnerHTML={{
            __html: `
                window.embeddedChatbotConfig = {
                  chatbotId: "wCNrHkqozTzmJ4SOQ8yCx",
                  domain: "www.chatbase.co"
                };
              `,
          }}
        />
        <Script
          src="https://www.chatbase.co/embed.min.js"
          data-chatbot-id="wCNrHkqozTzmJ4SOQ8yCx"
          data-domain="www.chatbase.co"
          defer
        />
        <Script
          src={process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL}
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="lazyOnload"
        />
        <body>
          <NextTopLoader color="#1e40af" />
          <Toaster position="top-center" />
          <ThemeProvider attribute="class" disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
