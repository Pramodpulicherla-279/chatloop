import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/src/components/theme/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChatLoop — Chat with Strangers Online",
  description:
    "Connect with random strangers instantly. Free anonymous chat platform — no sign-up required. Meet new people from around the world.",
  keywords: [
    "chat with strangers",
    "random chat",
    "anonymous chat",
    "stranger chat",
    "online chat",
    "meet new people",
    "chatloop",
  ],
  openGraph: {
    title: "ChatLoop — Chat with Strangers Online",
    description:
      "Connect with random strangers instantly. Free anonymous chat — no sign-up required.",
    type: "website",
    siteName: "ChatLoop",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChatLoop — Chat with Strangers Online",
    description: "Free anonymous chat with strangers. No sign-up needed.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
