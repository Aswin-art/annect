import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import  Statcounter from "@/components/Statcounter";
// import { GoogleAnalytics } from "nextjs-google-analytics";

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
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.embeddedChatbotConfig = {
                  chatbotId: "wCNrHkqozTzmJ4SOQ8yCx",
                  domain: "www.chatbase.co"
                };
              `,
            }}
          />
          <script
            src="https://www.chatbase.co/embed.min.js"
            data-chatbot-id="wCNrHkqozTzmJ4SOQ8yCx"
            data-domain="www.chatbase.co"
            defer
          />
        </head>
        <body>
          {/* <GoogleAnalytics trackPageViews /> */}
          <Statcounter/>
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
