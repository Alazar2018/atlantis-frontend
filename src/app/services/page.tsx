import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { buildMetadata } from "@/lib/seo";
import { studioImages } from "@/lib/studioImages";

export const metadata: Metadata = buildMetadata({
  title: "Corporate Leather Services | Atlantic Leather Partnerships",
  description:
    "Explore Atlantic Leather's corporate partnerships, bespoke leather manufacturing, and bulk order services for premium footwear, bags, belts, and accessories.",
  path: "/services",
  keywords: ["corporate leather services", "custom leather manufacturing", "bulk leather orders"],
});

const steps = [
  { n: "01", title: "The brief", copy: "You tell us the mark, the quantity, and who will carry it. We answer with hides and a timeline." },
  { n: "02", title: "The cut", copy: "Patterns are made for the order. Bulk does not mean a thinner hide or a faster stitch." },
  { n: "03", title: "The mark", copy: "Emboss, engrave, or leave it plain. The house’s hand stays visible either way." },
];

const partners = [
  "International organizations",
  "Corporations",
  "Government",
  "Schools",
  "Hospitality",
  "Retail",
  "NGOs",
  "Beverage houses",
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-ivory text-ink">
      <section className="bg-pine px-6 pb-16 pt-32 text-ivory sm:px-10">
        <div className="mx-auto max-w-[90rem]">
          <h1 className="font-display text-4xl md:text-5xl">Atelier services</h1>
          <p className="mt-4 max-w-xl text-ivory/80">
            Custom leather for companies: branding, bulk orders, and pieces finished by the same bench as the shop.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex bg-ivory px-6 py-3 text-sm font-medium text-ink transition-colors duration-200 hover:bg-carmine hover:text-ivory"
          >
            Start a brief
          </Link>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-10 lg:py-24">
        <div className="mx-auto grid max-w-[90rem] gap-6 lg:grid-cols-3">
          {steps.map((step) => (
            <article key={step.n} className="border-t border-ink/15 pt-5">
              <p className="text-sm text-carmine">{step.n}</p>
              <h2 className="mt-2 text-xl font-medium">{step.title}</h2>
              <p className="mt-3 font-light leading-relaxed text-ink/70">{step.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid lg:grid-cols-2">
        <div className="relative min-h-[420px]">
          <Image
            src={studioImages.wallet}
            alt="Small leather goods ready for a mark"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="flex flex-col justify-center bg-ink px-6 py-16 text-ivory sm:px-12 lg:px-16">
          <p className="text-[11px] uppercase tracking-[0.35em] text-carmine">What the bench will do</p>
          <h2 className="mt-4 font-display text-5xl leading-[0.95]">Your mark. Our hide.</h2>
          <ul className="mt-8 space-y-4 font-light text-ivory/80">
            <li>Logo embossing and engraving on bags, belts, and small goods.</li>
            <li>Bulk orders and corporate gifts, priced for the quantity, cut to the same standard.</li>
            <li>A catalog walk-through before anything is cut.</li>
          </ul>
        </div>
      </section>

      <section className="bg-ink px-6 py-16 text-ivory sm:px-10 lg:py-24">
        <div className="mx-auto max-w-[90rem]">
          <p className="text-[11px] uppercase tracking-[0.35em] text-ivory/80">Already in the room</p>
          <h2 className="mt-4 max-w-xl font-display text-5xl">Trusted across the city, and past it.</h2>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {partners.map((name) => (
              <li key={name} className="border border-ivory/25 px-4 py-6 font-display text-2xl">
                {name}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
