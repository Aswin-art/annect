import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

export const metadata: Metadata = {
  title: {
    default:
      "Annect - Event Akademik untuk Pelajar, Mahasiswa, dan Siswa di Seluruh Indonesia",
    template: "%s | Annect",
  },
  description:
    "Temukan berbagai event akademik seperti seminar, bootcamp, webinar, workshop, dan lomba di Annect. Jadilah penyelenggara atau ikuti event yang menarik untukmu!",
  keywords:
    "event akademik, seminar, bootcamp, webinar, workshop, lomba, mahasiswa, pelajar, siswa, Indonesia",
  authors: [{ name: "Annect", url: "https://annect.vercel.app/" }],
  alternates: {
    canonical: "https://annect.vercel.app/",
  },
  openGraph: {
    title:
      "Annect - Event Akademik untuk Pelajar, Mahasiswa, dan Siswa di Seluruh Indonesia",
    description:
      "Temukan berbagai event akademik seperti seminar, bootcamp, webinar, workshop, dan lomba di Annect. Jadilah penyelenggara atau ikuti event yang menarik untukmu!",
    url: "https://annect.vercel.app/",
    siteName: "Annect",
    images: [
      {
        url: "https://annect.vercel.app/logo.svg",
        width: 1200,
        height: 630,
        alt: "Annect - Event Akademik",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@annect",
    title:
      "Annect - Event Akademik untuk Pelajar, Mahasiswa, dan Siswa di Seluruh Indonesia",
    description:
      "Temukan berbagai event akademik seperti seminar, bootcamp, webinar, workshop, dan lomba di Annect. Jadilah penyelenggara atau ikuti event yang menarik untukmu!",
    images: ["https://annect.vercel.app/logo.svg"],
  },
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
                  chatbotId: "OdHgTCe8kJUcVV29jYRKG",
                  domain: "www.chatbase.co"
                };
              `,
          }}
        />
        <Script
          src="https://www.chatbase.co/embed.min.js"
          data-chatbot-id="OdHgTCe8kJUcVV29jYRKG"
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
