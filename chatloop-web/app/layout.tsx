import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/src/components/theme/ThemeProvider";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  verification: {
    google: "VTqWRMkklKs75XRZxKn0qFUoEQi-F_Hg2ckQFnCcSs8",
  },
  title: "ChatLoop — Random Chat with Strangers Online | Free & Anonymous",
  description:
    "Chat with random strangers instantly for free. No sign-up required. Meet new people, make friends, and have fun conversations. Anonymous stranger chat — connect with anyone worldwide.",
  keywords: [
    "random chat",
    "chat with strangers",
    "stranger chat",
    "random talk",
    "stranger talk",
    "anonymous chat",
    "online chat",
    "free chat",
    "meet strangers online",
    "talk to strangers",
    "random video chat alternative",
    "omegle alternative",
    "chat random",
    "stranger meetup",
    "make friends online",
    "chatloop",
  ],
  openGraph: {
    title: "ChatLoop — Random Chat with Strangers Online",
    description:
      "Chat with random strangers instantly. Free & anonymous — no sign-up required. Meet new people from around the world.",
    type: "website",
    siteName: "ChatLoop",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChatLoop — Random Chat with Strangers Online",
    description:
      "Free anonymous chat with strangers. No sign-up needed. Meet new people instantly.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1 },
  },
  alternates: {
    canonical: "https://chatloop-six.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      suppressHydrationWarning
    >
      <head>
        <meta name="monetag" content="51ffd7f6e124b42ef7581114b35c3d47" />

        {/* JSON-LD structured data — own tag so Google actually reads it */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "ChatLoop",
              url: "https://chatloop-six.vercel.app",
              description:
                "Free anonymous random chat with strangers. No sign-up required.",
              applicationCategory: "CommunicationApplication",
              operatingSystem: "Web",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            }),
          }}
        />
      </head>
      <body
        className="flex flex-col bg-background text-foreground"
        suppressHydrationWarning
      >
        <Script
          src="https://5gvci.com/act/files/tag.min.js?z=11127322"
          strategy="afterInteractive"
          data-cfasync="false"
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
