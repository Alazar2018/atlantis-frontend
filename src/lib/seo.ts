import type { Metadata } from "next";

const SITE_NAME = "Atlantic Leather";
const DEFAULT_DESCRIPTION =
  "Atlantic Leather crafts premium Ethiopian leather footwear, bags, gloves, belts, aprons, and accessories with over 18 years of expertise.";

const FALLBACK_URL = "https://atlanticleatherethiopia.com";

const envUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_VERCEL_URL ||
  process.env.VERCEL_URL;

export const SITE_URL = (() => {
  if (!envUrl) return FALLBACK_URL;
  const value = envUrl.startsWith("http") ? envUrl : `https://${envUrl}`;
  try {
    return new URL(value).origin;
  } catch {
    return FALLBACK_URL;
  }
})();

export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/logo/${encodeURIComponent(
  "English Horizontal.png"
)}`;

const DEFAULT_KEYWORDS = [
  "Atlantic Leather",
  "Ethiopian leather",
  "leather shoes",
  "leather bags",
  "leather goods",
  "handcrafted leather",
  "premium leather products",
  "leather manufacturer Ethiopia",
];

type BuildMetadataOptions = {
  title: string;
  description?: string;
  path?: string;
  keywords?: string[];
  images?: string[];
  type?: Metadata["openGraph"] extends { type: infer T } ? T : "website";
};

export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "",
  keywords = [],
  images,
  type = "website",
}: BuildMetadataOptions): Metadata {
  const canonicalUrl = new URL(path, SITE_URL).toString();
  const ogImages = (images && images.length > 0 ? images : [DEFAULT_OG_IMAGE]).map(
    (url) => ({
      url,
      width: 1200,
      height: 630,
      alt: title,
    })
  );

  const mergedKeywords = Array.from(
    new Set([...DEFAULT_KEYWORDS, ...keywords].map((keyword) => keyword.trim()))
  ).filter(Boolean);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: mergedKeywords,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages.map((img) => img.url),
    },
  };
}

export const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: DEFAULT_OG_IMAGE,
  description: DEFAULT_DESCRIPTION,
  foundingDate: "2006",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Tatek Industry Zone, Sheger City",
    addressLocality: "Sheger",
    addressRegion: "Oromia",
    addressCountry: "ET",
  },
  sameAs: [
    "https://www.facebook.com/atlantic.leather",
    "https://www.instagram.com/atlantic.leather",
    "https://www.linkedin.com/company/atlantic-leather",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "info@atlanticleather.com",
      telephone: "+251 963 666646",
      areaServed: "ET",
      availableLanguage: ["en"],
    },
  ],
};

export const marketingRoutes = [
  "/",
  "/products",
  "/services",
  "/about",
  "/contact",
  "/cart",
  "/login",
];


