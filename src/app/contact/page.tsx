import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = buildMetadata({
  title: "Contact Atlantic Leather | Visit Tatek Industry Zone Showroom",
  description:
    "Reach Atlantic Leather for product inquiries, custom orders, and partnerships. Visit our Tatek Industry Zone showroom or contact us via phone or email.",
  path: "/contact",
  keywords: ["Atlantic Leather contact", "Tatek Industry Zone leather", "Ethiopia leather manufacturer contact"],
});

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-ivory lg:grid lg:grid-cols-12">
      <aside className="bg-ink px-6 pb-16 pt-32 text-ivory sm:px-10 lg:col-span-5 lg:px-14 lg:pb-20 lg:pt-40">
        <h1 className="font-display text-4xl md:text-5xl">Contact us</h1>
        <p className="mt-4 max-w-sm leading-relaxed text-ivory/85">
          Orders, custom work, and visits. We reply from Tatek Industry Zone, Sheger City.
        </p>
        <dl className="mt-12 space-y-8 text-sm">
          <div>
            <dt className="text-[11px] uppercase tracking-[0.28em] text-ivory/70">Address</dt>
            <dd className="mt-2 font-display text-2xl">Tatek Industry Zone, Sheger City</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.28em] text-ivory/70">Phone</dt>
            <dd className="mt-2 font-display text-2xl">
              <a href="tel:+251963666646">+251 963 666646</a>
            </dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.28em] text-ivory/70">Email</dt>
            <dd className="mt-2 font-display text-2xl">
              <a href="mailto:info@atlanticleather.com">info@atlanticleather.com</a>
            </dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.28em] text-ivory/70">Hours</dt>
            <dd className="mt-2 space-y-1 font-light text-ivory/90">
              <p>Monday – Friday, 9:00 – 18:00</p>
              <p>Saturday, 10:00 – 16:00</p>
              <p>Sunday, the bench is quiet</p>
            </dd>
          </div>
        </dl>
      </aside>

      <section className="px-6 pb-16 pt-12 text-ink sm:px-10 lg:col-span-7 lg:px-16 lg:pb-20 lg:pt-40">
        <h2 className="font-display text-4xl">The note</h2>
        <ContactForm />
      </section>
    </div>
  );
}
