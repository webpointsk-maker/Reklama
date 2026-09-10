import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import CookieBar from "@/components/CookieBar";
import { SITE, BRAND } from "@/lib/content";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: SITE.title,
  description: SITE.description,
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
    siteName: BRAND.name,
    locale: "sk_SK",
    type: "website",
  },
  robots: { index: false, follow: false }, // landing page pre platenú návštevnosť
};

export const viewport: Viewport = {
  themeColor: "#ffffff", // musí sedieť s --color-ground v globals.css
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk" className={jakarta.variable}>
      <body className="font-sans antialiased">
        {children}
        <CookieBar />
      </body>
    </html>
  );
}
