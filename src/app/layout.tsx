import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const sans = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-outfit",
});
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "@/contexts/CartContext";
import { SITE_URL, buildMetadata, organizationStructuredData } from "@/lib/seo";

const baseMetadata = buildMetadata({
  title: "Atlantic Leather - Premium Leather Shoes & Products Since 2006",
  description:
    "Atlantic Leather crafts handcrafted leather shoes, bags, belts, gloves, aprons, and accessories in Ethiopia. Discover premium quality products made with 18+ years of expertise.",
});

export const metadata: Metadata = {
  ...baseMetadata,
  metadataBase: new URL(SITE_URL),
  applicationName: "Atlantic Leather",
  category: "Retail",
  icons: {
    icon: "/images/fav-icon/Color 1 - Carmine.png",
    shortcut: "/images/fav-icon/Color 1 - Carmine.png",
    apple: "/images/fav-icon/Color 1 - Carmine.png",
  },
  openGraph: {
    ...baseMetadata.openGraph,
    locale: "en_US",
  },
  twitter: {
    ...baseMetadata.twitter,
    creator: "@AtlanticLeather",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#941A20",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="antialiased bg-champagne font-sans text-ink">
        <CartProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <SiteFooter />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </CartProvider>
        <Script
          id="atlantic-leather-organization-schema"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify(organizationStructuredData)}
        </Script>
      </body>
    </html>
  );
}
